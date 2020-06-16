import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { FakeDatabase } from './fake-database.service';
import { ProductDTO } from '../model/productDTO';
import * as _ from 'lodash';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(private fakeDatabase: FakeDatabase) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const fb = this.fakeDatabase;
        let getSectionRegex = new RegExp('.*\/data\/getsections\/[0-9]+');
        let getProductsRegex = new RegExp('.*\/data\/getproducts\/[0-9]+');
        let getProductsByFloorRegex = new RegExp('.*\/data\/getproductsByFloor\/[0-9]+');
        let getproductsByAnyRegex = new RegExp('.*\/data\/getProductsByAny\/.*');
        let getproductbyidRegex = new RegExp('.*\/data\/getproductbyid\/[0-9]+');



        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(400))
            .pipe(dematerialize());

        function handleRoute() {
            let split;
            switch (true) {
                case url.endsWith('/data/getfloors') && method === 'GET':
                    return getFloors(fb);

                case url.endsWith('/data/getsections') && method === 'GET':
                    return getSections(fb);
                case url.match(getSectionRegex) && method === 'GET':
                    split = url.split('/');
                    return getSectionByFloorId(fb, parseInt(split[split.length - 1]));
                case url.match(getProductsRegex) && method === 'GET':
                    split = url.split('/');
                    return getProductsBySectionId(fb, parseInt(split[split.length - 1]));
                case url.match(getProductsByFloorRegex) && method === 'GET':
                    split = url.split('/');
                    return getProductsByFloorId(fb, parseInt(split[split.length - 1]));
                case url.match(getproductbyidRegex) && method === 'GET':
                    split = url.split('/');
                    return getProductById(fb, parseInt(split[split.length - 1]));


                case url.match(getproductsByAnyRegex) && method === 'GET':
                    split = url.split('/');
                    return getProductsByAny(fb, split[split.length - 1]);
                case url.endsWith('/data/putproduct/') && method === 'PUT':
                    return putProduct(fb, body);
                default:
                    return next.handle(request);
            }
        }

        // route functions
        function getFloors(fakeDatabase: FakeDatabase) {
            return ok({ floors: fakeDatabase.getFloors() });
        }

        function getSections(fakeDatabase: FakeDatabase) {
            return ok({ floors: fakeDatabase.getSections() });
        }

        function getSectionByFloorId(fakeDatabase: FakeDatabase, id: number) {
            let sections = fakeDatabase.getSectionByFloorId(id);
            if (sections) {
                return ok({ sections: sections });
            } else {
                return error("No floors for id " + id);
            }
        }

        function getProductsBySectionId(fakeDatabase: FakeDatabase, id: number) {
            let products = fakeDatabase.getProductBySectionId(id);
            if (products) {
                return ok({ products: products });
            } else {
                return error("No sections for id " + id);
            }
        }

        function getProductsByFloorId(fakeDatabase: FakeDatabase, id: number) {
            let products = fakeDatabase.products.filter(p => p.parentSection.parentFloor.id == id);
            if (products) {
                return ok({ products: products });
            } else {
                return error("No floor for id " + id);
            }
        }

        function getProductById(fakeDatabase: FakeDatabase, id: number){
            let product = fakeDatabase.products.find(p => p.id == id);
            if(product){
                return ok({product: product})
            }else{
                return error("No product for ID: " + id);
            }
        }

        function getProductsByAny(fakeDatabase: FakeDatabase, search: string) {
            let products = fakeDatabase.products.filter(p => p.id.toString().includes(search) ||
                p.code.includes(search) ||
                p.quantity.toString().includes(search) ||
                p.parentSection.name.includes(search) ||
                p.parentSection.parentFloor.name.includes(search)
            )
            return ok({ products: products });
        }

        function putProduct(fakeDatabase: FakeDatabase, body: ProductDTO) {

            if (body.id != null) {
                updateProduct(fakeDatabase, body)
            } else {
                createProduct(fakeDatabase, body);
            }
            return ok();
        }

        function createProduct(fakeDatabase: FakeDatabase, body: ProductDTO) {
            let parent = fakeDatabase.sections.find(s => s.id == body.parentSectionId);
            fakeDatabase.products.push({ id: FakeDatabase.productId++, quantity: body.quantity, parentSection: parent, code: body.code });
        }

        function updateProduct(fakeDatabase: FakeDatabase, body: ProductDTO) {
            let existingProductID = fakeDatabase.products.findIndex(p => p.id == body.id)
            if (existingProductID == -1) {
                createProduct(fakeDatabase, body);
                return;
            }
            let parent = fakeDatabase.sections.find(s => s.id == body.parentSectionId);
            fakeDatabase.products[existingProductID] = { id: body.id, quantity: body.quantity, parentSection: parent, code: body.code }
        }



        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
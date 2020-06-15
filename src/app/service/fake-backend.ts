import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { FakeDatabase } from './fake-database.service';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(private fakeDatabase: FakeDatabase) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const fb = this.fakeDatabase;
        let getSectionRegex = new RegExp('.*\/data\/getsections\/[0-9]+');
        let getProductsRegex = new RegExp('.*\/data\/getproducts\/[0-9]+');
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            let split;
            switch (true) {
                case url.endsWith('/data/getfloors') && method === 'GET':
                    return getFloors(fb);
                case url.match(getSectionRegex) && method === 'GET':
                    split = url.split('/');
                    return getSectionByFloorId(fb, parseInt(split[split.length - 1]));
                case url.match(getProductsRegex) && method === 'GET':
                    split = url.split('/');
                    return getProductsBySectionId(fb, parseInt(split[split.length - 1]));
                default:
                    return next.handle(request);
            }
        }

        // route functions
        function getFloors(fakeDatabase: FakeDatabase) {
            return ok({ floors: fakeDatabase.getFloors() });
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
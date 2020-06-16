import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from '../model/product.model';
import { ProductDTO } from '../model/productDTO';
import { Observable } from 'rxjs';

@Injectable()
export class WarehouseService {
    
    constructor(private http: HttpClient) {
    }

    getFloors() {
        return this.http.get<any>('/data/getfloors')
            .pipe(map(data => {
                return data;
            }));
    }

    getSectionByFloorId(floorId: number) {
        return this.http.get<any>(`/data/getsections/${floorId}`)
            .pipe(map(data => {
                return data;
            }));
    }

    getproductBySectionId(sectionId: any) {
        return this.http.get<any>(`/data/getproducts/${sectionId}`)
            .pipe(map(data => {
                return data;
            }));
    }

    getproductById(id: string) {
        return this.http.get<any>(`/data/getproductbyid/${id}`)
            .pipe(map(data => {
                return data;
            }));
      }
  

    getSections() {
        return this.http.get<any>(`/data/getproducts/`)
            .pipe(map(data => {
                return data;
            }));
    }

    putProduct(newProduct: ProductDTO) {
        return this.http.put<any>(`/data/putproduct/`, newProduct)
            .pipe(map(data => {
                return data;
            }));
    }

    getproductsByFloorID(floorId: number) {
        return this.http.get<any>(`/data/getproductsByFloor/${floorId}`)
            .pipe(map(data => {
                return data;
            }));
    }

    getProductByAnyString(search: string) {
        return this.http.get<any>(`/data/getProductsByAny/${search}`)
            .pipe(map(data => {
                return data;
            }));
    }
}
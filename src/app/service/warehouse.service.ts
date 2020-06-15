import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
}
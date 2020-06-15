import { Component, OnInit } from '@angular/core';
import { Floor } from 'src/app/model/floor.model';
import { Section } from 'src/app/model/section.model';
import { FakeDatabase } from 'src/app/service/fake-database.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { Product } from 'src/app/model/product.model';
import { Unsubscribing } from 'src/app/unsubscribing';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent extends Unsubscribing implements OnInit {

  floors: Floor[] = [];
  sections: Section[] = [];
  products: Product[] = [];

  constructor(private fakeDatabase: FakeDatabase, private warehouseService: WarehouseService) { super();}

  ngOnInit(): void {
    this.fakeDatabase.initializeData();
    this.getFloors();
  }

  getFloors() {
    this.warehouseService.getFloors().pipe(takeUntil(this.unsubscribe$)).subscribe(data => this.floors = data.floors);
  }

  _getSections(id) {
    this.warehouseService.getSectionByFloorId(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => this.sections = data.sections);
  }

  _getProducts(id) {
    this.warehouseService.getproductBySectionId(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => this.products = data.products);
  }

  _selectFloor(event) {
    
  }

}

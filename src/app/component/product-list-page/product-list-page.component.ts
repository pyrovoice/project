import { Component, OnInit } from '@angular/core';
import { Floor } from 'src/app/model/floor.model';
import { Section } from 'src/app/model/section.model';
import { FakeDatabase } from 'src/app/service/fake-database.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { Product } from 'src/app/model/product.model';
import { Unsubscribing } from 'src/app/unsubscribing';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent extends Unsubscribing implements OnInit {

  floors: Floor[] = [];
  sections: Section[] = [];
  products: Product[] = [];
  loading = false;

  private modelChanged: Subject<string> = new Subject<string>();
  debounceTime = 500;

  constructor(private warehouseService: WarehouseService) { super(); }

  ngOnInit(): void {
    this.getFloors();
    this.modelChanged
      .pipe(
        debounceTime(this.debounceTime)
      )
      .subscribe(value => {
        this.handleSearch(value);
      });
  }

  handleSearch(search: string){
    this.loading = true;
    this.warehouseService.getProductByAnyString(search).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.products = data.products;
      this.loading = false;
    });
  }

  inputChanged(event) {
    this.modelChanged.next(event.target.value)
  }


  getFloors() {
    this.loading = true;
    this.warehouseService.getFloors().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.floors = data.floors;
      this.loading = false;
    });

  }

  loadData(selectedFloorId) {
    this.loading = true;
    Promise.all([
      this._getSections(selectedFloorId),
      this._getProducts(selectedFloorId)
    ]).then(() => this.loading = false)
  }

  _getSections(id) {
    this.warehouseService.getSectionByFloorId(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.sections = data.sections
    });
  }

  _getProductsBySection(id) {
    this.loading = true;
    this.warehouseService.getproductBySectionId(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.products = data.products
      this.loading = false;
    });
  }

  _getProducts(id) {
    this.warehouseService.getproductsByFloorID(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.products = data.products
    });
  }
}

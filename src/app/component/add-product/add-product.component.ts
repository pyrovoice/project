import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { takeUntil } from 'rxjs/operators';
import { Unsubscribing } from 'src/app/unsubscribing';
import { Product } from 'src/app/model/product.model';
import { ProductDTO } from 'src/app/model/productDTO';
import { EnumProcess } from 'src/app/process.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent extends Unsubscribing implements OnInit {
  loading = true;
  floors = [];
  sections = [];
  form = new FormGroup({
    code: new FormControl("", [Validators.required, Validators.pattern("^[A-Z]{2,4} [0-9]{4,6}$")]),
    quantity: new FormControl("", [Validators.required, Validators.pattern("[0-9]*")]),
    floor: new FormControl("", [Validators.required]),
    section: new FormControl("", [Validators.required]),
  },
    { updateOn: "blur" });
  creationRequest = EnumProcess.INITIAL;
  EnumProcess = EnumProcess;
  productToEdit: Product;


  constructor(private warehouseService: WarehouseService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      await this.getFloors();
      let id = params.get("id")
      if (id) {
        let promise = await this.warehouseService.getproductById(id).toPromise();
        this.productToEdit = promise.product;
        await this.getSections(this.productToEdit.parentSection.parentFloor.id)
        this.ctrls.code.setValue(this.productToEdit.code);
        this.ctrls.code.disable();
        this.ctrls.quantity.setValue(this.productToEdit.quantity);
        this.ctrls.floor.setValue(this.productToEdit.parentSection.parentFloor.id);
        this.ctrls.section.setValue(this.productToEdit.parentSection.id);
      }
    });
  }

  getFloors() {
    this.loading = true;
    this.warehouseService.getFloors().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.floors = data.floors;
      this.loading = false;
    });

  }

  getSections(id) {
    this.resetSections();
    this.warehouseService.getSectionByFloorId(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.sections = data.sections;
    });
  }

  private resetSections(){
    this.ctrls.section.setValue("");
  }

  get ctrls() { return this.form.controls };

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.creationRequest = EnumProcess.LOADING
    const newProduct = { 
      id: this.productToEdit?.id, 
      code: this.ctrls.code.value, 
      parentSectionId: this.ctrls.section.value, 
      quantity: this.ctrls.quantity.value } as ProductDTO;
    this.warehouseService.putProduct(newProduct).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.creationRequest = EnumProcess.SUCCESS
    }, error => {
      this.creationRequest = EnumProcess.FAILURE
    });
  }
}

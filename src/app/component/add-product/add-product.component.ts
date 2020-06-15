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
    code: new FormControl('', [Validators.required, Validators.pattern("^[A-Z]{2,4} [0-9]{4,6}$")]),
    quantity: new FormControl("", [Validators.required, Validators.pattern("[0-9]*")]),
    floor: new FormControl("", [Validators.required]),
    section: new FormControl("", [Validators.required]),
  },
    { updateOn: "blur" });
  creationRequest = EnumProcess.INITIAL;
  EnumProcess = EnumProcess;


  constructor(private warehouseService: WarehouseService, private route: ActivatedRoute ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get("id")
      if()
  })
}
    this.getFloors();
  }

  getFloors() {
    this.loading = true;
    this.warehouseService.getFloors().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.floors = data.floors;
      console.log(this.floors)
      this.loading = false;
    });

  }

  getSections(id) {
    this.warehouseService.getSectionByFloorId(id).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.sections = data.sections;
    });
  }

  get f() { return this.form.controls };

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.creationRequest = EnumProcess.LOADING
    let newProduct = { code: this.f.code.value, parentSectionId: this.f.section.value, quantity: this.f.quantity.value } as ProductDTO;
    this.warehouseService.putProduct(newProduct).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      console.log("success")
      this.creationRequest = EnumProcess.SUCCESS
    }, error => {
      this.creationRequest = EnumProcess.FAILURE
    });
  }
}

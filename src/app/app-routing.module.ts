import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListPageComponent } from './component/product-list-page/product-list-page.component';
import { AddProductComponent } from './component/add-product/add-product.component';


const routes: Routes = [
  {
    path: "",
    component: ProductListPageComponent,
  },{
    path: "add",
    component: AddProductComponent,
  },{
    path: "add/:id",
    component: AddProductComponent,
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

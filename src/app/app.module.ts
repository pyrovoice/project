import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListPageComponent } from './component/product-list-page/product-list-page.component';
import { FakeDatabase } from './service/fake-database.service';
import { fakeBackendProvider } from './service/fake-backend';
import { WarehouseService } from './service/warehouse.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { AddProductComponent } from './component/add-product/add-product.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    ProductListPageComponent,
    SpinnerComponent,
    AddProductComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule, 
    FormsModule
  ],
  providers: [FakeDatabase, fakeBackendProvider, WarehouseService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListPageComponent } from './component/product-list-page/product-list-page.component';
import { FakeDatabase } from './service/fake-database.service';
import { fakeBackendProvider } from './service/fake-backend';
import { WarehouseService } from './service/warehouse.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ProductListPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [FakeDatabase, fakeBackendProvider, WarehouseService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

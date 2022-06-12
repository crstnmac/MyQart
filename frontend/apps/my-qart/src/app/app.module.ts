import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'
import { HomePageComponent } from './pages/home-page/home-page.component'
import { HeaderComponent } from './shared/header/header.component'
import { FooterComponent } from './shared/footer/footer.component'
import { AccordionModule } from 'primeng/accordion'
import { NavComponent } from './shared/nav/nav.component'
import { ProductsModule } from '@my-qart/products'
import { UiModule } from '@frontend/ui'
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { OrdersModule } from '@my-qart/orders'
import {JwtInterceptor, UsersModule} from "@my-qart/users";
import {MessageService} from "primeng/api";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";

const routes: Routes = [{ path: '', component: HomePageComponent }]

@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    ProductsModule,
    UiModule,
    AccordionModule,
    OrdersModule,
    UsersModule
  ],
  providers: [MessageService, {
    provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}

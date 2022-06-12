import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ConfirmationService, MessageService } from 'primeng/api'
import { CategoriesService } from '@my-qart/products'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { NxWelcomeComponent } from './nx-welcome.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { ShellComponent } from './shared/shell/shell.component'
import { SidebarComponent } from './shared/sidebar/sidebar.component'
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component'
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component'

import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { CardModule } from 'primeng/card'
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ToastModule } from 'primeng/toast'
import { ColorPickerModule } from 'primeng/colorpicker'
import { ProductsListComponent } from './pages/products/products-list/products-list.component'
import { ProductsFormComponent } from './pages/products/products-form/products-form.component'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputSwitchModule } from 'primeng/inputswitch'
import { DropdownModule } from 'primeng/dropdown'
import { CheckboxModule } from 'primeng/checkbox'
import { EditorModule } from 'primeng/editor'
import { UsersFormComponent } from './pages/users/users-form/users-form.component'
import { UsersListComponent } from './pages/users/users-list/users-list.component'
import { InputMaskModule } from 'primeng/inputmask'
import { PasswordModule } from 'primeng/password'
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component'
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component'
import { TagModule } from 'primeng/tag'
import { FieldsetModule } from 'primeng/fieldset'
import { JwtInterceptor, UsersModule } from '@my-qart/users'
import { AppRoutingModule } from './app-routing.module'
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";

const UX_MODULE = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  InputTextModule,
  ConfirmDialogModule,
  ColorPickerModule,
  InputNumberModule,
  InputTextareaModule,
  InputSwitchModule,
  DropdownModule,
  CheckboxModule,
  EditorModule,
  InputMaskModule,
  PasswordModule,
  TagModule,
  FieldsetModule,
]

@NgModule({
  declarations: [
    AppComponent,
    NxWelcomeComponent,
    DashboardComponent,
    ShellComponent,
    SidebarComponent,
    CategoriesListComponent,
    CategoriesFormComponent,
    ProductsListComponent,
    ProductsFormComponent,
    UsersFormComponent,
    UsersListComponent,
    OrdersListComponent,
    OrdersDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UsersModule,
    ...UX_MODULE,
  ],
  providers: [
    CategoriesService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

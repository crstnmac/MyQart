import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsSearchComponent } from './components/products-search/products-search.component'
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component'
import { RouterModule, Routes } from '@angular/router'
import { ProductItemComponent } from './components/product-item/product-item.component'
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component'
import { ButtonModule } from 'primeng/button'
import { ImageModule } from 'primeng/image'
import { ProductsListComponent } from './pages/products-list/products-list.component'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'

const routes: Routes = [
  {
    path: 'products',
    component: ProductsListComponent,
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    ImageModule,
    CheckboxModule,
    FormsModule,
  ],
  declarations: [
    ProductsSearchComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
  ],
  exports: [
    ProductsSearchComponent,
    CategoriesBannerComponent,
    ProductItemComponent,
    FeaturedProductsComponent,
    ProductsListComponent,
  ],
})
export class ProductsModule {}

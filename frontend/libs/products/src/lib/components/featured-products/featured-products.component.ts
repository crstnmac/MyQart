import { Subject, takeUntil } from 'rxjs'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Product } from '../../models/product'
import { ProductsService } from '../../services/products.service'

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [],
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  endSubs$: Subject<any> = new Subject()
  featuredProducts: Product[] = []

  constructor(private prodService: ProductsService) {}

  ngOnInit(): void {
    this._getFeaturedProducts()
  }

  private _getFeaturedProducts() {
    this.prodService
      .getFeaturedProducts(4)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        this.featuredProducts = products
      })
  }

  ngOnDestroy(): void {
    this.endSubs$.next(this.featuredProducts)
    this.endSubs$.complete()
  }
}

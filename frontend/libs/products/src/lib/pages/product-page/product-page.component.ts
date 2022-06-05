import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subject, takeUntil } from 'rxjs'
import { Product } from '../../models/product'
import { ProductsService } from '../../services/products.service'
import {CartItem, CartService} from "@my-qart/orders";

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product: Product
  endSub$: Subject<any> = new Subject()
  quantity = 1
  constructor(
    private prodService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['productid']) {
        this._getProduct(params['productid'])
      }
    })
  }

  private _getProduct(id: string) {
    this.prodService
      .getProduct(id)
      .pipe(takeUntil(this.endSub$))
      .subscribe((res) => {
        this.product = res
      })
  }

  ngOnDestroy(): void {
    this.endSub$.next(this.product)
    this.endSub$.complete()
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity,
    }
    this.cartService.setCartItem(cartItem);
  }
}

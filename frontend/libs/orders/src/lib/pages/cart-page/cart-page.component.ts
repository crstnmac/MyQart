import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {OrdersService} from "../../services/orders.service";
import { CartItemDetailed} from "../../models/cart";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemsDetailed : CartItemDetailed[] = []
  cartCount = 0
  endSubs$:Subject<any> = new Subject()
  constructor(private router:Router,private cartService:CartService,private ordersService:OrdersService) { }

  ngOnInit(): void {
    this._getCartDetails();
  }

  ngOnDestroy(): void {
    this.endSubs$.next(this.cartService)
    this.endSubs$.complete()
  }

  private _getCartDetails(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe( respCart => {
      this.cartItemsDetailed = []
      this.cartCount = respCart?.items?.length ?? 0
      respCart.items.forEach(cartItem => {
        this.ordersService.getProduct(cartItem.productId!).subscribe(resProduct => {
          this.cartItemsDetailed.push({
            product: resProduct,
            quantity: cartItem.quantity
          })
        })
      })
    })
  }

  updateCartItemQuantity(event:any,cartItem:CartItemDetailed) {
    this.cartService.setCartItem({productId: cartItem.product.id, quantity: event.value},true)
  }

  backToShop(){
    this.router.navigate(['/products'])
  }

  removeItem(cartItem:CartItemDetailed){
    this.cartService.deleteCartItem(cartItem.product.id!)
  }
}

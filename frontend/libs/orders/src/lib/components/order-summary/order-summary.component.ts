import { Component, OnInit } from '@angular/core';
import {Subject, take, takeUntil} from "rxjs";
import {CartService} from "../../services/cart.service";
import {OrdersService} from "../../services/orders.service";
import {Router} from "@angular/router";

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit {
  endSubs$:Subject<any> = new Subject()
  totalPrice: number
  isCheckout = false

  constructor(private cartService:CartService,private orderService: OrdersService,private router:Router) {
    this.router.url.includes('checkout') ? this.isCheckout = true : this.isCheckout = false
  }

  ngOnInit(): void {
    this._getOrderSummary()
  }

  private _getOrderSummary(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(cart => {
      this.totalPrice = 0
      if(cart){
        cart.items.map(item => {
          this.orderService
            .getProduct(item.productId!)
            .pipe(take(1))
            .subscribe(product => {
              this.totalPrice += product.price! * item.quantity!
            })
        })
      }
    })
  }

  navigateToCheckout(){
    this.router.navigate(['/checkout'])
  }

}

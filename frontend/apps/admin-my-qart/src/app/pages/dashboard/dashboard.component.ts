import { Component, OnDestroy, OnInit } from '@angular/core'
import { OrdersService } from '@my-qart/orders'
import { ProductsService } from '@my-qart/products'
import { UsersService } from '@my-qart/users'
import { combineLatest, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  endSubs$ = new Subject()
  statistics = []
  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnDestroy(): void {
    this.endSubs$.next(this.statistics)
    this.endSubs$.complete()
  }

  ngOnInit(): void {
    combineLatest([
      this.usersService.getUsersCount(),
      this.productsService.getProductsCount(),
      this.ordersService.getOrdersCount(),
      this.ordersService.getOrdersTotalSales(),
    ])
      .pipe(takeUntil(this.endSubs$))
      .subscribe((values: any) => {
        this.statistics = values
      })
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Order, OrdersService } from '@my-qart/orders'
import { ConfirmationService, MessageService } from 'primeng/api'
import { interval, take, lastValueFrom, Subject, takeUntil } from 'rxjs'
import { ORDER_STATUS } from '../order.constants'

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = []
  endsubs$ = new Subject()

  orderStatus: { [index: number]: { label: string; color: string } } =
    ORDER_STATUS

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.endsubs$.next(this.orders)
    this.endsubs$.complete()
  }

  ngOnInit(): void {
    this.getOrders()
  }

  deleteOrder(orderId: string) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    const deleteCat = () => {
      this.orderService.deleteOrder(orderId).subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Order deleted',
            detail: 'Order deleted successfully',
          })
          this.getOrders()
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Order deletion failed',
            detail: `Order deletion failed: ${error.message}`,
          })
        },
        next: () => {
          execute().then(() => {
            this.messageService.clear()
          })
        },
      })
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete this order?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        deleteCat()
      },
    })
  }

  onOrderClick(orderId: string) {
    this.router.navigateByUrl(`orders/view/${orderId}`)
  }

  private getOrders() {
    this.orderService
      .getOrders()
      .pipe(takeUntil(this.endsubs$))
      .subscribe((orders: Order[]) => {
        this.orders = orders
      })
  }
}

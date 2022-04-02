import { ActivatedRoute } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { Order, OrderItem, OrdersService } from '@my-qart/orders'
import { ORDER_STATUS } from '../order.constants'
import { MessageService } from 'primeng/api'
import { interval, lastValueFrom, take } from 'rxjs'

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss'],
})
export class OrdersDetailComponent implements OnInit {
  order: Order = {}
  orderItems: OrderItem[] | any = []
  orderStatuses: any = []
  selectedStatus: any = {}

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._mapOrderStatuses()
    this._getOrder()
  }

  onStatusChange(event: any) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.orderService
      .updateOrder({ status: event.value }, this.order.id as string)
      .subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Order updated',
            detail: 'Order updated successfully',
          })
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Order updation failed',
            detail: `Order updation failed: ${error.message}`,
          })
        },
        next: () => {
          execute().then(() => {
            this.messageService.clear()
          })
        },
      })
  }

  private _mapOrderStatuses() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key: any) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label,
      }
    })
  }

  private _getOrder() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.orderService.getOrder(params['id']).subscribe((order) => {
          this.order = order
          this.orderItems = order.orderItems
          this.selectedStatus = order.status
        })
      }
    })
  }
}

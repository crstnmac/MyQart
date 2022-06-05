import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Order } from '../models/order'
import { map, Observable } from 'rxjs'
import {Product} from "@my-qart/products";

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiURLOrders = environment.apiURL + '/orders'
  apiURLProducts = environment.apiURL + '/products'

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders)
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`)
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order)
  }

  deleteOrder(orderId: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiURLOrders}/${orderId}`)
  }

  updateOrder(
    orderStaus: { status: string },
    orderId: string
  ): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStaus)
  }

  getOrdersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount))
  }

  getOrdersTotalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalsales))
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<any>(`${this.apiURLProducts}/${productId}`)
  }

}

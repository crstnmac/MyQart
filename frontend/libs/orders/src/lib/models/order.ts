import { User } from '@my-qart/users'
import { OrderItem } from './order-item'

export class Order {
  id?: string
  orderItems?: OrderItem[]
  shippingAddress1?: string
  shippingAddress2?: string
  shippingCity?: string
  shippingState?: string
  shippingZip?: string
  shippingCountry?: string
  phone?: string
  status?: string
  totalPrice?: number
  user?: User
  dateCreated?: string
}

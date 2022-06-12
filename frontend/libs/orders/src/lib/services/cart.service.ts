import { Injectable } from '@angular/core';
import {Cart, CartItem} from "../models/cart";
import {BehaviorSubject, Subject} from "rxjs";

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.getCart());

  constructor() {}

  initCartLocalStorage() {
    const cart: Cart = this.getCart()
    if(!cart) {
      const initialCart = {
        items: []
      }
      const initialCartJson = JSON.stringify(initialCart)
      localStorage.setItem(CART_KEY, initialCartJson)
    }
  }

  emptyCart() {
    const initialCart = {
      items: []
    }
    const initialCartJson = JSON.stringify(initialCart)
    localStorage.setItem(CART_KEY, initialCartJson)
    this.cart$.next(initialCart);
  }

  getCart() : Cart {
    const cart: Cart = localStorage.getItem(CART_KEY) === null ? this.emptyCart() :  JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?:boolean) : Cart {
    const cart: Cart = this.getCart();
    const cartItemExist = cart.items.find(item => item.productId === cartItem.productId)
    if(cartItemExist) {
      cart.items.map((item) => {
        if(item.productId === cartItem.productId) {
          if(updateCartItem) {
            item.quantity! = cartItem.quantity!
          }else{
            item.quantity! += cartItem.quantity!
          }
        }
        return item
      })
    }else {
      cart.items.push(cartItem)
    }
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart
  }

  deleteCartItem(productId: string)  {
    const cart: Cart = this.getCart();
    const newCart =  cart.items.filter(item => item.productId !== productId)
    cart.items = newCart;
    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);
    this.cart$.next(cart);
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {User, UsersService} from "@my-qart/users";
import {MessageService} from "primeng/api";
import {interval, lastValueFrom, Subject, take, takeUntil} from "rxjs";
import {CartService} from "../../services/cart.service";
import {OrderItem} from "../../models/order-item";
import {Location} from "@angular/common";
import {Cart} from "../../models/cart";
import {OrdersService} from "../../services/orders.service";
import {Order} from "../../models/order";

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [],
  providers: [MessageService]
})
export class CheckoutPageComponent implements OnInit,OnDestroy {

  isSubmitted = false
  orderItems: OrderItem[] = []
  currentUser: User
  userId: string | undefined
  countries: { value: string; label: string }[] = []
  unSub$: Subject<any> = new Subject()

  form: UntypedFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    street: ['', Validators.required],
    appartment: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
  })

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UsersService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private ordersService: OrdersService,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form
    this._getCartItems()
    this._getCountries()
    this._autoFillUserData()
  }

  ngOnDestroy(): void {
    this.unSub$.next(this.userService)
    this.unSub$.complete()
  }

  onSubmit() {
    this.isSubmitted = true
    if (this.form.invalid) {
      return
    }

    const orderFormData: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.form.value.street,
      shippingAddress2: this.form.value.appartment,
      shippingCity: this.form.value.city,
      shippingZip: this.form.value.zip,
      shippingCountry: this.form.value.country,
      shippingState: 'Example',
      status: '0',
      phone: this.form.value.phone,
      user: this.currentUser,
      dateCreated: `${Date.now()}`,
    }

    this._placeOrder(orderFormData)
  }

  backToCart() {
    this.form.reset()
    this.location.back()
  }


  private _getCartItems() {
    const cart: Cart = this.cartService.getCart()
    this.orderItems = cart.items.map(item => {
      return {
        product: item.productId,
        quantity: item.quantity,
      }
    })
  }


  private _placeOrder(orderData: Order) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.ordersService.createOrder(orderData).subscribe({
      complete: () => {
        this.isSubmitted = true
        this.cartService.emptyCart()
        this.router.navigate(['/success'])
        this.messageService.add({
          severity: 'success',
          summary: `Order created`,
          detail: 'Order created successfully',
        })
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Order creation failed',
          detail: `Order creation failed: ${error.message}`,
        })
      },
      next: () => {
        execute().then(() => {
          this.messageService.clear()
          this.form.reset()
          this.isSubmitted = false
        })
      },
    })
  }


  private _getCountries() {
    this.countries = this.userService.getCountries()
  }

  get userForm() {
    return this.form.controls
  }

  private _autoFillUserData() {
    this.userService.observeCurrentUser().pipe(takeUntil(this.unSub$)).subscribe((user) => {
      if(user) {
        this.userId = user.id
        this.currentUser = user
        this.form.patchValue({
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          street: user?.street,
          appartment: user?.appartment,
          zip: user?.zip,
          city: user?.city,
          country: user?.country,
        })
      }
    })
  }
}

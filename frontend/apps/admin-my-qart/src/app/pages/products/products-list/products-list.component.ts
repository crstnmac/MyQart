import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Product, ProductsService } from '@my-qart/products'
import { ConfirmationService, MessageService } from 'primeng/api'
import { interval, lastValueFrom, Subject, take, takeUntil } from 'rxjs'

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = []
  endSubs$ = new Subject()
  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.endSubs$.next(this.products)
    this.endSubs$.complete()
  }

  ngOnInit(): void {
    this.getProducts()
  }

  deleteProduct(productId: string) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    const deleteProd = () => {
      this.productService.deleteProduct(productId).subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Product deleted',
            detail: 'Product deleted successfully',
          })
          this.getProducts()
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Product deletion failed',
            detail: `Product deletion failed: ${error.message}`,
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
      message: 'Do you want to delete this product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        deleteProd()
      },
    })
  }

  updateProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`)
  }

  private getProducts() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        this.products = products
      })
  }
}

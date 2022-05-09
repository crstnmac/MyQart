import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject, takeUntil } from 'rxjs'
import { Category } from '../../models/category'
import { Product } from '../../models/product'
import { CategoriesService } from '../../services/categories.service'
import { ProductsService } from '../../services/products.service'

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  endSubs$: Subject<any> = new Subject()
  products: Product[] = []
  categories: Category[] = []
  constructor(
    private productService: ProductsService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this._getProducts()
    this._getCategories()
  }

  private _getProducts(categoriesFilter?: string[] | undefined) {
    this.productService
      .getProducts(categoriesFilter)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => {
        this.products = res
      })
  }

  private _getCategories() {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => {
        this.categories = res
      })
  }

  ngOnDestroy(): void {
    this.endSubs$.next(this.categories)
    this.endSubs$.next(this.products)
    this.endSubs$.complete()
  }

  categoryFilter() {
    const selectedCategories = this.categories
      .filter((category) => category.checked)
      .map((cat) => cat.id)

    this._getProducts(selectedCategories as string[])
  }
}

import { MessageService } from 'primeng/api'
import { CategoriesService, Category } from '@my-qart/products'
import { Component, OnInit } from '@angular/core'
import { interval, lastValueFrom, take } from 'rxjs'
import { ConfirmationService } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [],
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = []

  constructor(
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategories()
  }

  deleteCategory(categoryId: string) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    const deleteCat = () => {
      this.categoryService.deleteCategory(categoryId).subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Category deleted',
            detail: 'Category deleted successfully',
          })
          this.getCategories()
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Category deletion failed',
            detail: `Category deletion failed: ${error.message}`,
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
      message: 'Do you want to delete this category?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        deleteCat()
      },
    })
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`)
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories
    })
  }
}

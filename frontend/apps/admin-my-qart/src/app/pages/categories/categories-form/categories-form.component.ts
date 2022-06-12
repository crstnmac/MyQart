import { ActivatedRoute } from '@angular/router'
import { CategoriesService, Category } from '@my-qart/products'
import { Component, OnInit } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { interval, lastValueFrom, take } from 'rxjs'
import { Location } from '@angular/common'

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [],
})
export class CategoriesFormComponent implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    icon: ['', Validators.required],
    color: ['', Validators.required],
  })
  isSubmited = false
  editMode = false
  currentCategoryId!: string

  constructor(
    private formBuilder: UntypedFormBuilder,
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form
    this._checkEditMode()
  }

  onSubmit() {
    this.isSubmited = true
    if (this.form.invalid) {
      return
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value,
      color: this.categoryForm['color'].value,
    }

    if (this.editMode) {
      this._updateCategory(category)
    } else {
      this._addCategory(category)
    }

    /**
     * `lastValueFrom` returns a `Promise` that resolves to the last value emitted by the source
     * observable
     * basically the --execute()-- function returns afters 2 secs
     */
  }

  onCancel() {
    this.form.reset()
    this.location.back()
  }

  private _addCategory(category: Category) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.categoryService.createCategory(category).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: `Category ${category.name}  created`,
          detail: 'Category created successfully',
        })
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Category creation failed',
          detail: `Category creation failed: ${error.message}`,
        })
      },
      next: () => {
        execute().then(() => {
          this.messageService.clear()
          this.form.reset()
          this.isSubmited = false
          this.location.back()
        })
      },
    })
  }

  private _updateCategory(category: Category) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.categoryService.updateCategory(category).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: `Category ${category.name}  updated`,
          detail: 'Category updated successfully',
        })
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Category updation failed',
          detail: `Category updation failed: ${error.message}`,
        })
      },
      next: () => {
        execute().then(() => {
          this.messageService.clear()
          this.form.reset()
          this.isSubmited = false
          this.location.back()
        })
      },
    })
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.editMode = true
        this.currentCategoryId = params['id']
        this.categoryService.getCategory(params['id']).subscribe((category) => {
          this.form.patchValue({
            name: category.name,
            icon: category.icon,
            color: category.color,
          })
        })
      }
    })
  }

  get categoryForm() {
    return this.form.controls
  }
}

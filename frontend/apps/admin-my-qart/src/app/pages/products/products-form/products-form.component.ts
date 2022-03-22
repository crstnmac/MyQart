import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { CategoriesService, Category, ProductsService } from '@my-qart/products'
import { interval, lastValueFrom, take } from 'rxjs'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [],
})
export class ProductsFormComponent implements OnInit {
  editMode = false
  isSubmited = false
  categories: Category[] = []
  imageDisplay: string | ArrayBuffer | undefined
  imageFile: File
  currentProductId!: string

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    price: ['', Validators.required],
    category: ['', Validators.required],
    countInStock: ['', Validators.required],
    description: ['', Validators.required],
    richDescription: [''],
    image: ['', Validators.required],
    isFeatured: [false],
  })

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form
    this._getCategories()
    this._checkEditMode()
  }

  onSubmit() {
    this.isSubmited = true
    if (this.form.invalid) {
      return
    }

    const productFormData = new FormData()
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value)
    })

    if (this.editMode) {
      this._updateProduct(productFormData)
    } else {
      this._addProduct(productFormData)
    }
  }

  onCancel() {
    this.form.reset()
    this.location.back()
  }

  onImageUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files

    if (file) {
      this.form.patchValue({ image: file[0] })
      this.form.updateValueAndValidity()
      const fileReader = new FileReader()
      fileReader.onload = () => {
        this.imageDisplay = fileReader?.result ?? ''
      }
      fileReader.readAsDataURL(file[0])
    }
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories
    })
  }

  private _addProduct(productData: FormData) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.productService.createProduct(productData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: `Product ${productData.get('name')}  created`,
          detail: 'Product created successfully',
        })
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Product creation failed',
          detail: `Product creation failed: ${error.message}`,
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

  private _updateProduct(productData: FormData) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.productService
      .updateProduct(productData, this.currentProductId)
      .subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: `Product ${productData.get('name')}  updated`,
            detail: 'Product updated successfully',
          })
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Product updation failed',
            detail: `Product updation failed: ${error.message}`,
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
        this.currentProductId = params['id']
        this.productService.getProduct(params['id']).subscribe((product) => {
          this.form.patchValue({
            name: product.name,
            brand: product.brand,
            price: product.price,
            category: product.category?.id,
            countInStock: product.countInStock,
            description: product.description,
            richDescription: product.richDescription,
            image: product.image,
            isFeatured: product.isFeatured,
          })
          this.imageDisplay = product.image
          this.form.get('image')?.setValidators([])
          this.form.get('image')?.updateValueAndValidity()
        })
      }
    })
  }

  get productForm() {
    return this.form.controls
  }
}

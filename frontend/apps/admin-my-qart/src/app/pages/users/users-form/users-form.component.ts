import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { User, UsersService } from '@my-qart/users'
import { MessageService } from 'primeng/api'
import { interval, lastValueFrom, take } from 'rxjs'

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [],
})
export class UsersFormComponent implements OnInit {
  editMode = false
  isSubmited = false
  currentUserId!: string
  countries: { value: string; label: string }[] = []

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],
    isAdmin: [false],
    street: [''],
    appartment: [''],
    zip: [''],
    city: [''],
    country: [''],
  })

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private userService: UsersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form
    this._getCountries()
    this._checkEditMode()
  }

  onSubmit() {
    this.isSubmited = true
    if (this.form.invalid) {
      return
    }

    const userFormData: User = {
      id: this.currentUserId,
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      password: this.userForm['password'].value,
      phone: this.userForm['phone'].value,
      isAdmin: this.userForm['isAdmin'].value,
      street: this.userForm['street'].value,
      appartment: this.userForm['appartment'].value,
      zip: this.userForm['zip'].value,
      city: this.userForm['city'].value,
      country: this.userForm['country'].value,
    }

    if (this.editMode) {
      this._updateUser(userFormData)
    } else {
      this._addUser(userFormData)
    }
  }

  onCancel() {
    this.form.reset()
    this.location.back()
  }

  private _addUser(userData: User) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.userService.createUser(userData).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: `User ${userData.name}  created`,
          detail: 'User created successfully',
        })
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'User creation failed',
          detail: `User creation failed: ${error.message}`,
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

  private _updateUser(userData: User) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.userService.updateUser(userData, this.currentUserId).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: `User ${userData.name}  updated`,
          detail: 'User updated successfully',
        })
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'User updation failed',
          detail: `User updation failed: ${error.message}`,
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
        this.currentUserId = params['id']
        this.userService.getUser(params['id']).subscribe((user) => {
          this.form.patchValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            street: user.street,
            appartment: user.appartment,
            zip: user.zip,
            city: user.city,
            country: user.country,
          })
          this.form.get('password')?.setValidators([])
          this.form.get('password')?.updateValueAndValidity()
        })
      }
    })
  }

  private _getCountries() {
    this.countries = this.userService.getCountries()
  }

  get userForm() {
    return this.form.controls
  }
}

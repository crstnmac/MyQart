import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { interval, lastValueFrom, take } from 'rxjs'
import { AuthService } from '../../services/auth.service'
import { LocalStorageService } from '../../services/localstorage.service'

@Component({
  selector: 'frontend-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup
  isSubmitted = false
  authError = false
  authMessage = 'Email or password are wrong'
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initLoginForm()
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  onSubmit() {
    this.isSubmitted = true
    if (this.loginFormGroup.invalid) return

    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    this.auth
      .login(this.loginForm['email'].value, this.loginForm['password'].value)
      .subscribe({
        complete: () => {
          this.authError = false
          this.messageService.add({
            severity: 'success',
            summary: 'Success ',
            detail: 'Login Successful',
          })
        },
        error: (error: HttpErrorResponse) => {
          this.authError = true
          if (error.status !== 400) {
            this.authMessage = 'Something went wrong, please try again later'
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: `Login Failed: ${error.message}`,
          })
        },
        next: (user) => {
          this.localStorageService.setToken(user.token as string)
          this.router.navigate(['/'])
          execute().then(() => {
            this.messageService.clear()
          })
        },
      })
  }

  get loginForm() {
    return this.loginFormGroup.controls
  }
}

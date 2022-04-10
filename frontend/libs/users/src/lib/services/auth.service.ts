import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { environment } from '@env/environment'
import { User } from '../models/user'
import { Observable } from 'rxjs'
import { LocalStorageService } from './localstorage.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURLUsers = environment.apiURL + '/users'

  constructor(
    private http: HttpClient,
    private token: LocalStorageService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/login`, {
      email,
      password,
    })
  }

  logOut() {
    this.token.removeToken()
    this.router.navigate(['/login'])
  }
}

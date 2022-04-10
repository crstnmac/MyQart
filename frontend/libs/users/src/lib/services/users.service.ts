import { User } from '../models/user'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { map, Observable } from 'rxjs'
import * as countriesLib from 'i18n-iso-countries'

declare const require: any

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiURLUsers = environment.apiURL + '/users'

  constructor(private http: HttpClient) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'))
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers)
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`)
  }

  createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/register`, userData)
  }

  deleteUser(userId: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiURLUsers}/${userId}`)
  }

  updateUser(user: User, userId: string): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${userId}`, user)
  }

  getCountries(): { value: string; label: string }[] {
    return Object.entries(
      countriesLib.getNames('en', { select: 'official' })
    ).map((entry) => {
      return {
        value: entry[0],
        label: entry[1],
      }
    })
  }

  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en')
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount))
  }
}

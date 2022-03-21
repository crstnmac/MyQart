import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Category } from '../models/category'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  apiURLCategories = environment.apiURL + '/categories'

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories)
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`)
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category)
  }

  deleteCategory(categoryId: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.apiURLCategories}/${categoryId}`)
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiURLCategories}/${category.id}`,
      category
    )
  }
}

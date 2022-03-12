import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Category } from '../models/category'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(
      `http://localhost:3000/api/v1/categories/${categoryId}`
    )
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/api/v1/categories')
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(
      'http://localhost:3000/api/v1/categories',
      category
    )
  }

  deleteCategory(categoryId: string): Observable<unknown> {
    return this.http.delete<unknown>(
      `http://localhost:3000/api/v1/categories/${categoryId}`
    )
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(
      `http://localhost:3000/api/v1/categories/${category._id}`,
      category
    )
  }
}

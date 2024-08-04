import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../app/api/models/auth.model';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8084/blogs'; // Define API base URL

  constructor(private http: HttpClient) { }

  getAllBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBlogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  createBlog(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, formData);
  }
  // Method to fetch sorted blogs by date (old or new)
  getBlogsByDateOld(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/sort/old`);
  }

  getCoursesByDateNew(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/sort/new`);
  }
  // Method to fetch sorted blogs by category
  getBlogsByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sort/${category}`);
  }

  findByTitle(title: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?title=${title}`);
  }
  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

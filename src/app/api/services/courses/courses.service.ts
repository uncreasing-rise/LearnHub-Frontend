import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseDetail, Courses } from '../../models/auth.model'; // Kiểm tra xem liệu này có phải là 'Courses' hay 'ResponeCourseDTO' không?
import { ResponeCourseDTO } from '../../models/auth.model'; // Thay đổi đường dẫn đến ResponeCourseDTO nếu cần thiết
import { Comment } from '../../models/auth.model';
const baseUrl = 'http://localhost:8084/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = baseUrl + 'courses'; // Thêm biến apiUrl

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(
      this.apiUrl, // Sử dụng biến apiUrl thay vì baseUrl + 'courses'
      httpOptions
    );
  }

  get(id: any): Observable<Courses> {
    return this.http.get<Courses>(`${this.apiUrl}/${id}`); // Sử dụng biến apiUrl thay vì baseUrl
  }

  createCourse(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addCourse`, formData);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data); // Sử dụng biến apiUrl thay vì baseUrl
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`); // Sử dụng biến apiUrl thay vì baseUrl
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.apiUrl); // Sử dụng biến apiUrl thay vì baseUrl
  }

  findByTitle(title: any): Observable<Courses[]> {
    return this.http.get<Courses[]>(`${this.apiUrl}?title=${title}`); // Sử dụng biến apiUrl thay vì baseUrl
  }

  getAllCourses(): Observable<ResponeCourseDTO[]> {
    return this.http.get<ResponeCourseDTO[]>(this.apiUrl);
  }
  getCoursesByCategory(categoryId: String): Observable<ResponeCourseDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }
  getCoursesByPriceLower(): Observable<ResponeCourseDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/price/lower`);
  }
  getListCoursesByPriceRange(minPrice: number, maxPrice: number): Observable<ResponeCourseDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }
  getCoursesByDateNew(): Observable<ResponeCourseDTO[]> {
    return this.http.get<any[]>(`${this.apiUrl}/date/new`);
  }
  getCourseDetail(courseId: number): Observable<CourseDetail> {
    return this.http.post<any>(`${this.apiUrl}/showSectionAndVideo/${courseId}`, {});
  }
  getCommentsForCourse(courseId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${courseId}/comments`);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }
  
}

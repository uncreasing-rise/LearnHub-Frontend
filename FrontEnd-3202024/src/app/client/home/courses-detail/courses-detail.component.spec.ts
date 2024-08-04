import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:8084/courses'; // Thay thế bằng URL của API

  constructor(private http: HttpClient) { }

  getCoursesDetail(courseId: number): Observable<any> {
    const url = `${this.apiUrl}/showSectionAndVideo/${courseId}`;
    return this.http.get<any>(url);
  }
}

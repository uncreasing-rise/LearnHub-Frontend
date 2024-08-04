import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8084/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = baseUrl + 'api/categories'; // Thêm biến apiUrl

  constructor(private http: HttpClient) { }

  getListCategory(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

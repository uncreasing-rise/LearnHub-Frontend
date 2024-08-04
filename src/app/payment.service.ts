import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) { }

  pay(total: number, userId: number, cartId: number): Observable<any> {
    const apiUrl = `http://localhost:8084/pay/${cartId}/${total}/${userId}`;

    return this.http.get<any>(apiUrl);
  }
}

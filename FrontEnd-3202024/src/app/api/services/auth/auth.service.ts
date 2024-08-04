import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs';
import { of } from 'rxjs';

const AUTH_API = 'http://localhost:8084/api/user/v1/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any; // Store the current user information

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${AUTH_API}login`,
      {
        email,
        password,
      },
      httpOptions
    );
  }
  isLoggedIn(): boolean {
    // Logic to check if the user is logged in
    // For example, you might check if there's a valid access token stored in local storage
    return !!localStorage.getItem('accessToken');
  }
  verifySignup(email: string, otp: string): Observable<any> {
    return this.http.post(
      `${AUTH_API}verify`,
      {
        otp,
        email,
      },
      httpOptions
    );
  }

  // Lưu thông tin người dùng vào session
  setUserInfo(userInfo: any): void {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  // Lấy thông tin người dùng từ session
  getInfo(): any {
    const userInfoString = sessionStorage.getItem('userInfo');
    return userInfoString ? JSON.parse(userInfoString) : null;
  }
  getCurrentUser(): Observable<any> {
    // Assuming the user information is obtained from an API endpoint
    return this.http.get<any>('http://localhost:8084/api/user/v1/info').pipe(
      catchError(error => {
        console.error('Error fetching user info:', error);
        return of(null); // Return an Observable that emits null in case of an error
      })
    );
  }
  register(
    fullname: string,
    password: string,
    email: string,
    facebook: string
  ): Observable<any> {
    return this.http.post(
      `${AUTH_API}register`,
      {
        fullname,
        email,
        password,
        facebook,
      },
      httpOptions
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      `${AUTH_API}forgetPassword`,
      {
        email,
      },
      httpOptions
    );
  }

  verifyForgotPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(
      `${AUTH_API}verifyForgetPassword`,
      {
        email,
        otp,
        newPassword,
      },
      httpOptions
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const accessToken = localStorage.getItem('accessToken');
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    return this.http.post(`${AUTH_API}avatar`, formData, httpOptionsAuth);
  }

  updateUserInfo(
    id: any,
    fullname: string,
    facebook: string,
    image: string,
    roleId: number = 2,
    enable: boolean = true
  ): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    return this.http.put(
      `${AUTH_API}${id}`,
      {
        fullname,
        facebook,
        image,
        roleId,
        enable,
      },
      httpOptionsAuth
    );
  }

  getUserInfo(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    return this.http.get(`${AUTH_API}info`, httpOptionsAuth);
  }

  logout(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    return this.http.post(`${AUTH_API}signout`, {}, httpOptionsAuth);
  }
}
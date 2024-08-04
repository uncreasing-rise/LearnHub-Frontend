import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:8084/api/user/v1/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const accessToken = localStorage.getItem('accessToken');

const httpOptionsAuth = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }),
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUser(): Observable<any> {
    return this.http.get(
      AUTH_API + 'list',
      httpOptions
    );
  }

  getAllUserDeleted(): Observable<any> {
    return this.http.get(
      AUTH_API + 'listDeleted',
      httpOptions
    );
  }

  getDetailUser(id: any): Observable<any> {
    return this.http.get(
      AUTH_API + `info/${id}`,
      httpOptions
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(
      AUTH_API + `${id}`,
      httpOptionsAuth
    );
  }
  restoreUser(id: any): Observable<any> {
    return this.http.post(
      AUTH_API + `restore/${id}`,
      httpOptionsAuth
    );
  }
  UpdatelUser(id: any,
    fullname: string,
    email: any,
    image: string,
    roleId?: 2,
    enable?: true): Observable<any> {

    return this.http.put(
      AUTH_API + `${id}`, {
      fullname,
      email,
      image,
      roleId,
      enable,
    },
      httpOptionsAuth
    );
  }
}

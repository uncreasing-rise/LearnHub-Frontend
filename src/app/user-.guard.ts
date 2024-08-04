import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './api/services/auth/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    // Check if the user is authenticated (token is present)
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Redirect to login page if token is not present
      this.router.navigate(['/login']);
      return false; // Prevent access if token is not present
    }

    // Decode the token to get user information and check the role
    const userRole = this.decodeToken(token).role;

    // Check if the user has the required role
    if (userRole === 'STUDENT') {
      return true; // Allow access if user's role is "STUDENT"
    } else {
      // If the user's role is not "STUDENT", redirect to unauthorized page
      this.router.navigate(['/unauthorized']);
      return false; // Prevent access if user's role is not "STUDENT"
    }
  }

  decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  }
}

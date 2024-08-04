import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './api/services/auth/auth.service'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.getUserInfo().pipe(
        map(role => {
          if (role == 'ADMIN') {
            return true; // User is an admin, allow access
          } else {
            // User is not an admin or not logged in, redirect to login page
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
          }
        })
      );
  }
}

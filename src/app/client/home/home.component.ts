import { Component, EventEmitter } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../api/services/auth/auth.service';
import { CoursesService } from '../../api/services/courses/courses.service';

import { BlogService } from '../../blog-service.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent {


  userInfo: any;
  coursesList: any;
  name: string = '';
  password: string = '';
  email: string = '';
  emailLogin: string = '';
  passwordLogin: string = '';
  facebook: string = '';
  emailVerifySignup: string = '';
  emailForgetPassword: string = '';
  otpForgetPassword: string = '';
  newPassword: string = '';
  otp: string = '';
  isVerifyScreen: boolean = false;
  isForgotPasswordScreen: boolean = false;
  isVerifyPasswordScreen: boolean = false;
  isEmptyCart: boolean = false;
  title = 'learnHub';
  parentEmitter = new EventEmitter<string>();
  newRecommendedCourses: any[] = [];
  cheapHighQualityCourses: any[] = [];
blogs: any;
  constructor(
    private router: Router, 
    private authService: AuthService, 
    private CoursesService: CoursesService,     private blogService: BlogService
    ) { }
  ngOnInit() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogs = data;
    });
    this.getCourses(); // Gọi phương thức để lấy danh sách khóa học từ API
    this.isEmptyCart = this.hasItemsInCart();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userInfo = JSON.parse(userData);
    }
    this.parentEmitter.emit('Hello from the parent component!');
    this.getCoursesByPriceLower();
    this.getCoursesByDateNew(); 
  }
  chunkArray(array: any[], size: number): any[][] {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
  getCoursesByPriceLower(): void {
    this.CoursesService.getCoursesByPriceLower().subscribe(courses => {
      this.cheapHighQualityCourses = courses;
    });
  }
  getCoursesByDateNew(): void {
    this.CoursesService.getCoursesByDateNew().subscribe(courses => {
      this.newRecommendedCourses = courses;
    });
  }
  getCourses(): void {
    this.CoursesService.getAllCourses()
      .subscribe(courses => {
        this.coursesList = courses;
      });
      
  }
  
  trackByIdx(index: number, item: any): number {
    return item.courseID;
  }
  onChange(key: string, e: any) {
    if (key == 'name') {
      this.name = e.target.value;
    } else if (key == 'password') {
      this.password = e.target.value;
    } else if (key == 'email') {
      this.email = e.target.value;
    } else if (key == 'facebook') {
      this.facebook = e.target.value;
    } else if (key == 'emailVerifySignup') {
      this.emailVerifySignup = e.target.value;
    } else if (key == 'otp') {
      this.otp = e.target.value;
    } else if (key == 'emailLogin') {
      this.emailLogin = e.target.value;
    } else if (key == 'passwordLogin') {
      this.passwordLogin = e.target.value;
    } else if (key == 'emailForgetPassword') {
      this.emailForgetPassword = e.target.value;
    } else if (key == 'otpForgetPassword') {
      this.otpForgetPassword = e.target.value;
    } else if (key == 'newPassword') {
      this.newPassword = e.target.value;
    }
  }
  logout() {
    localStorage.removeItem('user');
    this.userInfo = null;
    window.location.reload();
  }
  onSignup() {
    this.authService
      .register(this.name, this.password, this.email, this.facebook)
      .subscribe(
        (response) => {
          this.isVerifyScreen = true;
          const signupModal = document.getElementById('signup');
          if (signupModal) {
            signupModal.classList.remove('show');
            signupModal.setAttribute('aria-hidden', 'true');
            signupModal.setAttribute('style', 'display: none;');
            document.body.classList.remove('modal-open');
          }
        },
        (error) => {
          // Handle login error
          alert('Signup failed');
          console.error('Signup failed', error);
        }
      );
  }

  onClosePopupVerify() {
    this.isVerifyScreen = false;
  }

  onVerifySignup() {
    this.authService.verifySignup(this.email, this.otp).subscribe(
      (response) => {
        alert('verify success');
        // Handle successful verify
        // const userJson = JSON.stringify(response.payload);
        // localStorage.setItem('user', userJson);
        this.isVerifyScreen = false;
        // location.reload();
      },
      (error) => {
        alert('verify failed');
        console.error('verify failed', error);
      }
    );
  }

  decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  }


  onSignin() {
    this.authService.login(this.emailLogin, this.passwordLogin).subscribe(
      (response) => {
        const { accessToken, refreshToken } = response.payload;
        const accessTokenPayload = this.decodeToken(accessToken);
        const userInfo = {
          id: accessTokenPayload.id,
          email: accessTokenPayload.email,
          fullname: accessTokenPayload.name,
          role: accessTokenPayload.role,
          // Add other user properties as needed
        };
        const userJson = JSON.stringify(userInfo);
        localStorage.setItem('user', userJson);
        localStorage.setItem('accessToken', accessToken);
  
        if (accessTokenPayload.role.includes('ADMIN')) {
          // Check if the user is an admin and redirect to admin dashboard
          this.router.navigate(['http://localhost:4200//admin/courses']);
        } else {
          // If not an admin, reload the current page
          window.location.reload();
        }
      },
      (error) => {
        // Handle login error
        alert('Login failed');
        console.error('Login failed', error);
      }
    );
  }
  

  onForgotPassword() {
    this.isForgotPasswordScreen = true;
    const signinModal = document.getElementById('signin');
    if (signinModal) {
      signinModal.classList.remove('show');
      signinModal.setAttribute('aria-hidden', 'true');
      signinModal.setAttribute('style', 'display: none;');
      document.body.classList.remove('modal-open');
    }
  }

  onSubmitEmailForgetPassword() {
    this.authService.forgotPassword(this.emailForgetPassword).subscribe(
      (response) => {
        this.isForgotPasswordScreen = false;
        this.isVerifyPasswordScreen = true;
      },
      (error) => {
        alert('forgot password failed');
        console.error('forgot password  failed', error);
      }
    );
  }

  hasItemsInCart(): boolean {
    const storedCardItem: any = localStorage.getItem('cardItem');
    const cartFromStorage = JSON.parse(storedCardItem);
    
    return cartFromStorage && cartFromStorage.length > 0;
  }

  onSubmitVerifyPassword() {
    this.authService
      .verifyForgotPassword(
        this.emailForgetPassword,
        this.otpForgetPassword,
        this.newPassword
      )
      .subscribe(
        (response) => {
          window.location.reload();
          alert('change password success');
        },
        (error) => {
          alert('change password failed');
          console.error('change password  failed', error);
        }
      );
  }
}

import {   AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild, EventEmitter } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../api/services/auth/auth.service';
import { CategoryService } from '../api/services/category/category.service';
import { CoursesService } from '../api/services/courses/courses.service';
@Component({
  selector: 'app-course-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './course-home.component.html',
  styleUrl: './course-home.component.css'

})
export class CourseHomeComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 9;
  userInfo: any;
  filteredCourses: any;
  searchTerm: string = '';
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
  listCategory : any[] = [];
  minValues: any;
  maxValues: any ;
  selectedCategory: any;
  constructor(
    private router: Router, 
    private route:ActivatedRoute,
    private authService: AuthService, 
    private categoryService:CategoryService,
    private CoursesService: CoursesService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;

     }
    
  ngOnInit() {
    this.searchTerm = this.route.snapshot.params['searchTerm'];
    this.minValues = this.route.snapshot.params['minValues'];
    this.maxValues = this.route.snapshot.params['maxValues'];
    this.route.params.subscribe(params => {
      this.searchTerm = params['searchTerm'];
      this.getCourses();
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
    this.getListCategory();
  }
  getListCategory(): void {
    this.categoryService.getListCategory().subscribe(res => {
      this.listCategory = res;
    });
  }
  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  get coursesToShow(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCourses.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get pagedCourses(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCourses.slice(startIndex, endIndex);
  }
  getCourses(): void {
    this.CoursesService.findByTitle(this.searchTerm)
      .subscribe(courses => {
        this.coursesList = courses;
        this.filterCourses(); // Call filterCourses after retrieving courses
      });
  }

  getCoursesByCategory(categoryId: string): void {
    // Find the category object by categoryId in the list of categories
    const category = this.listCategory.find(category => category.categoryId === categoryId);
    if (category) {
      // If category is found, set it as the selected category
      this.selectedCategory = category;
      // Get courses by category
      this.CoursesService.getCoursesByCategory(categoryId)
        .subscribe(courses => {
          this.coursesList = courses;
          this.filterCourses(); // Apply filtering if necessary
        });
    } else {
      // Handle case when category is not found
      console.log(`Category with Id '${categoryId}' not found.`);
    }
  }

  getListCoursesByPriceRange(): void {
    this.CoursesService.getListCoursesByPriceRange(this.minValues, this.maxValues)
      .subscribe(courses => {
        this.coursesList = courses;
        this.filterCourses(); // Call filterCourses after retrieving courses
      });
  }

  filterCourses(): void {
    if (!this.searchTerm && !this.minValues && !this.maxValues && !this.selectedCategory) {
      // If no filters applied, show all courses
      this.filteredCourses = this.coursesList;
    } else {
      this.filteredCourses = this.coursesList.filter((course: any) => {
        // Check if the course matches the search term
        const searchTermMatch = !this.searchTerm || Object.values(course).some(value =>
          value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
  
        // Check if the course price is within the specified range
        const priceInRange = (!this.minValues || course.coursePrice >= this.minValues) &&
                             (!this.maxValues || course.coursePrice <= this.maxValues);
  
        // Check if the course belongs to the selected category
        const categoryMatch = !this.selectedCategory || course.categoryName === this.selectedCategory.categoryName;
  
        // Return true if all conditions are met
        return searchTermMatch && priceInRange && categoryMatch;
      });
    }
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

        if (accessTokenPayload.role.includes('Admin')) {
          this.router.navigate(['/admin/courses']);
        } else {
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

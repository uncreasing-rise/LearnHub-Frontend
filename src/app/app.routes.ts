import { Routes } from '@angular/router';
import { HomeComponent } from './client/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './dashboard/user/user.component';
import { CoursesDetailComponent } from './client/home/courses-detail/courses-detail.component';
import { CoursesComponent } from './dashboard/courses/courses.component';
import { UserInfoComponent } from './client/user-info/user-info.component';
import { IncomeComponent } from './dashboard/income/income.component';
import { BlogComponent } from './dashboard/blog/blog.component';
import { CartComponent } from './client/cart/cart.component';
import { CourseHomeComponent } from './course-home/course-home.component';
import { WishlistComponent } from './client/user-info/wishlist/wishlist.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ListBlogComponent } from './list-blog/list-blog.component';
import { CourseNotRegisterdComponent } from './course-not-registerd/course-not-registerd.component';
import { QuizComponent } from './quiz/quiz.component';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from './user-.guard';
export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'userInfo', component: UserInfoComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'course-home', component: CourseHomeComponent },
  { path: 'my-wishlist', component: WishlistComponent},
  { path: 'list-blogs', component: ListBlogComponent },

  { path: 'course-notregistered', component: CourseNotRegisterdComponent },

  {
    path: 'courses/showSectionAndVideo/:id',
    component: CoursesDetailComponent,
    title: 'courses details', 
  },  {
    path: 'course-home/courses/showSectionAndVideo/:id',
    component: CoursesDetailComponent,
    title: 'courses details'
  },
  {
    path: 'blogs/:id',
    component: BlogDetailComponent,
    title: 'blogs details'
  }, {
    path: 'list-blogs/blogs/:id',
    component: BlogDetailComponent,
    title: 'blogs details',
  },{
    path: 'quiz/:quizId',
    component: QuizComponent,
    title: 'Quiz'
  },



  
  {
    path: 'admin',
    component: DashboardComponent,
    children: [
      { path: 'user', component: UserComponent, },
      { path: 'courses', component: CoursesComponent , },
      { path: 'blog', component: BlogComponent,  },
      { path: 'income', component: IncomeComponent , },
    ],
  },
];

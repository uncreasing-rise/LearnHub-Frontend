import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { routes } from './app.routes';

// export const routes: Routes = [
//   {
//     path: '',
//     component: HomeComponent,
//   },
//   {
//     path: 'admin',
//     canActivateChild: [CanActivateChild],
//     component: DashboardComponent,
//     children: [{ path: 'user', component: UserComponent }],
//   },
//   // {
//   //   path: 'admin',
//   //   component: CoursesComponent,
//   // },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

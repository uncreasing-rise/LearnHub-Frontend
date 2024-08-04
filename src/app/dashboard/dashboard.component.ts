import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  constructor() { }
  ngOnInit() {

  }
  Logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    window.location.href = 'http://localhost:4200/';
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../api/services/auth/auth.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../wishlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistItemDTO } from '../../api/models/auth.model';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  standalone: true,
  imports: [ RouterLink,CommonModule, FormsModule],

  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfo: any;
  fullname: any;
  age: any;
  phone: any;
  email: any;
  image: any;
  frame: any;
  facebook: any;
imageselectedFile: File | undefined;
wishlistList: any;
constructor(private wishlistService: WishlistService, private router: Router, private authService: AuthService, private http: HttpClient) { }

 
  getUserInfo() {
    this.authService.getUserInfo().subscribe(
      (response: any) => {
        this.userInfo = {
          id: response.payload.id,
          email: response.payload.email,
          fullname: response.payload.fullname,
          facebook: response.payload.facebook,
          image: response.payload.image,
          role: response.payload.role,
        };
        localStorage.setItem('user', JSON.stringify(this.userInfo));
      },
      (error) => {
        alert('Failed to retrieve user info');
        console.error('Error retrieving user info:', error);
      }
    );
  }
  
  
  onUpdateImage() {
    if (!this.imageselectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.imageselectedFile);

    this.http.post<any>('http://localhost:8084/api/user/v1/avatar', formData).subscribe(
      (response) => {
        console.log('Image upload successful:', response);
        if (typeof response.url === 'string') {
          this.image = response.url;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Image upload failed:', error);
      }
    );
  }

  onFileImageSelected(event: any) {
    this.imageselectedFile = event.target.files[0]; // Update the selected file when a new file is selected
  }
  handleUpdateInfo(key: string, e: any) {
    if (key === 'fullname') {
      this.fullname = e.target.value;
    } else if (key === 'age') {
      this.age = e.target.value;
    } else if (key === 'phone') {
      this.phone = e.target.value;
    } else if (key === 'image') {
      this.image = e.target.value;
      this.frame = document.getElementById('frame');
      this.frame.src = URL.createObjectURL(e.target.files[0]);
      this.onFileSelected(e);
    } else if (key === 'email') {
      this.email = e.target.value;
    } else if (key === 'facebook') {
      this.facebook = e.target.value;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:8084/api/user/v1/avatar', formData).subscribe(
      (response) => {
        console.log('Image upload successful:', response);
        if (typeof response.url === 'string') {
          this.image = response.url;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Image upload failed:', error);
      }
    );
  }
  
  onUpdateUserInfo() {
    this.authService.updateUserInfo(
      this.userInfo.id,
      this.fullname,
      this.facebook,
      this.image
    ).subscribe(
      (response) => {
        alert('Update successful');
        this.getUserInfo();
      },
      (error) => {
        alert('Update failed');
        console.error('Update failed', error);
      }
    );
  }
  
  ngOnInit() {
    this.getUserInfo();

    this.getWishlists();
    
  }
  getWishlists(): void {

    const userId = this.userInfo.id;
    this.wishlistService.getAllWishlistItems(userId).subscribe(
      (wishlists: WishlistItemDTO[]) => {
        this.wishlistList = wishlists;
      },
      (error) => {
        console.error('Error fetching wishlists:', error);
        // Handle error appropriately (e.g., display error message to user)
      }
    );
  }
  
}

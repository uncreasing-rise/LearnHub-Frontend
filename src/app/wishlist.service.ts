import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistItem } from './api/models/auth.model';
import { WishlistItemDTO } from './api/models/auth.model';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient) { }

  addToWishlist(wishlistItem: WishlistItem): Observable<WishlistItem> {
    return this.http.post<WishlistItem>('http://localhost:8084/wishlist/add', wishlistItem);
  }

// Change the parameter name from 'id' to 'courseId'
deleteFromWishlist(courseId: number, userId: number): Observable<void> {
  return this.http.delete<void>(`http://localhost:8084/wishlist/delete/${courseId}/${userId}`);
}

checkIfInWishlist(courseId: number, userId: number): Observable<boolean> {
  const url = `http://localhost:8084/wishlist/check/${courseId}/${userId}`;
  return this.http.get<boolean>(url);
}
  // Add additional methods for retrieving, updating, and deleting wishlist items
  getAllWishlistItems(userId: number): Observable<WishlistItemDTO[]> {
    const url = `http://localhost:8084/wishlist/all/${userId}`;
    return this.http.get<WishlistItemDTO[]>(url);
  }
}

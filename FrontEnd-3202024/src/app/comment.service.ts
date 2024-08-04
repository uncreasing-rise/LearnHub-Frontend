import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDTO } from './api/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8084/comments'; // Base URL of your backend API

  constructor(private http: HttpClient) { }

  // Method to create a new comment
  createComment(comment: CommentDTO): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(`${this.baseUrl}/create`, comment);
  }

  // Method to update an existing comment
  updateComment(id: number, updatedComment: CommentDTO): Observable<CommentDTO> {
    return this.http.put<CommentDTO>(`${this.baseUrl}/${id}`, updatedComment);
  }

  // Method to delete a comment by ID
  deleteComment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // Method to retrieve a comment by ID
  getCommentById(id: number): Observable<CommentDTO> {
    return this.http.get<CommentDTO>(`${this.baseUrl}/${id}`);
  }
}

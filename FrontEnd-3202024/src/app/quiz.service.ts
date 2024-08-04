import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from './api/models/auth.model'; 
import { QuizAnswerResponse } from './api/models/auth.model'; 

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:8084/api/quizzes'; // Update with your actual API URL

  constructor(private http: HttpClient) { }
  private addTokenToHeader(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
  }
  createQuizToSection(sectionId: number, quiz: Quiz): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/${sectionId}/quizzes`, quiz);
  }

  deleteQuizFromSection(sectionId: number, quizId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sectionId}/quizzes/${quizId}`);
  }

  getQuiz(quizId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${quizId}`);
  }

  submitAnswer(quizId: number, submitAnswerRequest: QuizAnswerResponse): Observable<QuizAnswerResponse> {
    return this.http.post<QuizAnswerResponse>(`${this.apiUrl}/${quizId}/submit`, submitAnswerRequest, { headers: this.addTokenToHeader() });
  }

  getAnswerHistory(quizId: number): Observable<QuizAnswerResponse[]> {
    return this.http.get<QuizAnswerResponse[]>(`${this.apiUrl}/${quizId}/history`, { headers: this.addTokenToHeader() });
  }
}

import { Component, OnInit } from '@angular/core';
import { QuizService } from '../quiz.service';
import { Quiz } from '../api/models/auth.model';
import { QuizAnswerResponse } from '../api/models/auth.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders,  HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class QuizComponent implements OnInit {
  quiz: Quiz = {};
  quizId: number = 0;
  id: number = 0;
  showQuiz: boolean = false;
  submittedAnswer: string = '';
  quizHistory: any[] = [];
  answerHistory: QuizAnswerResponse[] = [];
  selectedAnswers: Map<number, string> = new Map<number, string>();
  constructor(private route: ActivatedRoute, private quizService: QuizService, private http: HttpClient) { }
  startQuiz(): void {
    this.loadQuiz();
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.quizId = +params['quizId'];
    });
  }

  loadQuiz(): void {
    this.quizService.getQuiz(this.quizId).subscribe(
      (quiz: Quiz) => {
        this.quiz = quiz;
        this.showQuiz = true;
      },
      (error) => {
        console.error('Error loading quiz:', error);
      }
    );
  }

  
  submitAnswer(): void {
    const startTime = new Date();
    const endTime = new Date();

    const answerRequest: any = {
      quizId: this.quizId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      answerRequests: []
    };

    this.selectedAnswers.forEach((answerId, questionId) => {
      answerRequest.answerRequests.push({
        questionId: questionId,
        answerId: answerId
      });
    });

    this.quizService.submitAnswer(this.quizId, answerRequest).subscribe(
      (response: any) => {
        console.log('Answer submitted successfully:', response);
        console.log('Answer:', answerRequest);
        window.alert(`Your points: ${response.payload.point}`);
        window.location.reload();
      },
      (error) => {
        console.error('Error submitting answer:', error);
      }
    );
  }

  loadQuizHistory(): void {
    this.quizService.getAnswerHistory(this.quizId).subscribe(
      (response: any) => {
        this.quizHistory = response.payload;
        this.openQuizHistoryModal();
      },
      (error) => {
        console.error('Error loading quiz history:', error);
      }
    );
  }
  openQuizHistoryModal(): void {
    // Code to open the modal
  }

  
  
  selectAnswer(questionId: number, answerId: number): void {
    this.selectedAnswers.set(questionId, answerId.toString());
  }
}
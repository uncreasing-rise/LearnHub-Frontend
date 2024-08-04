import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  newCommentText: string = ''; // Initialize here
  comment: Comment = new Comment(); 

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
  }




}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog-service.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: any;
  id: any;

  constructor(private blogService: BlogService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the blog id from the route parameters
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      // Call the BlogService to fetch the blog details
      this.blogService.getBlogById(this.id).subscribe(data => {
        this.blog = data;
      });
    });
  }
}

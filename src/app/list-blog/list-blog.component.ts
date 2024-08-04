import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog-service.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  OnDestroy,
  ViewChild, EventEmitter
} from '@angular/core';
import { CategoryService } from '../api/services/category/category.service';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.css'],
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true
})
export class ListBlogComponent implements OnInit {
  trackByIdx(index: number, blog: any): number {
    return blog.id;
  }
  listCategory: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 9;
  selectedCategory: any;
  newRecommendedCourses: any;
  searchTerm: string = '';
  blogList: any[] = [];
  filterCategory: string = ''; // To store the selected category for filtering
  sortOption: string = ''; // To store the selected sorting option
  filteredBlogs: any;

  constructor(private blogService: BlogService, private categoryService: CategoryService,
  ) { }
  get totalPages(): number {
    return Math.ceil(this.filteredBlogs.length / this.itemsPerPage);
  }
  changePage(page: number): void {
    this.currentPage = page;
  }
  ngOnInit(): void {
    this.getBlogs();
    this.getListCategory();
    this.getCoursesByDateNew();
    this.getCoursesByDateOld
  }
  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
  getBlogs(): void {
    this.blogService.findByTitle(this.searchTerm)
      .subscribe(blogs => {
        this.blogList = blogs;
        this.filteredBlogs = this.blogList;
      });
  }
  get pagedBlogs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBlogs.slice(startIndex, endIndex);
  }
  // Method to filter blogs based on category



  getListCategory(): void {
    this.categoryService.getListCategory().subscribe(res => {
      this.listCategory = res;
    });
  }
  getCoursesByCategory(categoryId: string): void {
    // Find the category object by categoryId in the list of categories
    const category = this.listCategory.find((category: { categoryId: string; }) => category.categoryId === categoryId);
    if (category) {
      // If category is found, set it as the selected category
      this.selectedCategory = category;
      // Get courses by category
      this.blogService.getBlogsByCategory(categoryId)
        .subscribe(courses => {
          this.blogList = courses;
          this.filterBlogs(); // Apply filtering if necessary
        });
    } else {
      // Handle case when category is not found
      console.log(`Category with Id '${categoryId}' not found.`);
    }
  }


  // Method to chunk array into smaller arrays
  chunkArray(array: any[], size: number): any[][] {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  getCoursesByDateOld(): void {
    this.blogService.getBlogsByDateOld().subscribe((blogs: any) => {
      this.newRecommendedCourses = blogs;
    }, (error: any) => {
      console.error(`Error fetching courses by date old: ${error}`);
    });
  }

  getCoursesByDateNew(): void {
    this.blogService.getCoursesByDateNew().subscribe((blogs: any) => {
      this.newRecommendedCourses = blogs;
    }, (error: any) => {
      console.error(`Error fetching courses by date old: ${error}`);
    });
  }

  filterBlogs(): void {
    if (!this.searchTerm && !this.selectedCategory) {
      // If no filters applied, show all courses
      this.filteredBlogs = this.blogList;
    } else {
      this.filteredBlogs = this.blogList.filter((blog: any) => {
        // Check if the course matches the search term
        const searchTermMatch = !this.searchTerm || Object.values(blog).some(value =>
          value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );


        // Check if the course belongs to the selected category
        const categoryMatch = !this.selectedCategory || blog.categoryName === this.selectedCategory.categoryName;

        // Return true if all conditions are met
        return searchTermMatch && categoryMatch;
      });
    }
  }
}

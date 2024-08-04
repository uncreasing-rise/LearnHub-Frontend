import { NgxPaginationModule } from 'ngx-pagination';
import { BlogService } from '../../blog-service.service';
import { CategoryService } from '../../api/services/category/category.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementRef, Renderer2 } from '@angular/core';

@Component({

  selector: 'app-blog',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  currentPage: number = 1;
  searchTerm: string = '';
  blogsList: any[] = [];
  filteredBlogs: any[] = [];
  activeTab: any = 'tab1';
  blogForm: FormGroup;
  blogs: any[] = [];
  listCategory: any[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private blogService: BlogService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.blogForm = this.fb.group({
      blogDTO: this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        category: this.fb.group({
          categoryId: ['', Validators.required],
          categoryName: ['', Validators.required]
        }),
      }),
      image: File,
    });
  }

  ngOnInit() {
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogs = data;
    });
    this.getListCategory();
  }
  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  getListCategory(): void {
    this.categoryService.getListCategory().subscribe(res => {
      this.listCategory = res;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.blogForm.patchValue({ image: file }); // Cập nhật giá trị trường image trong form
  }

  onSubmit(): void {
    const blogDTO = this.blogForm.value.blogDTO; // Sử dụng blogDTO chính xác
    const image = this.blogForm.value.image;
    const formData = new FormData();
    formData.append('blogDTO', new Blob([JSON.stringify(blogDTO)], {
      type: 'application/json'
    }));
    if (image) {
      formData.append('image', image);
    }

    // Gửi yêu cầu POST đến server
    this.blogService.createBlog(formData).subscribe(
      response => {
        console.log("BlogDTO:", JSON.stringify(blogDTO));
        console.log("Image:", image);
        console.log("Success:", response);
        window.alert('Blog Added successfully.');
        window.location.reload();
      },
      error => {
        console.log("Error:", error);
      }
    );
    // window.location.reload() 
  }


  openTab(tabName: string) {
    this.activeTab = tabName
    const tablinks = this.el.nativeElement.querySelectorAll('.tab-links');
    const tabcontents = this.el.nativeElement.querySelectorAll('.tab-contents');

    tablinks.forEach((tablink: HTMLElement) => {
      this.renderer.removeClass(tablink, 'active-link');
    });

    tabcontents.forEach((tabcontent: HTMLElement) => {
      this.renderer.removeClass(tabcontent, 'active-tab');
    });

    const clickedTabLink = this.el.nativeElement.querySelector(`.tab-links[data-tab="${tabName}"]`);
    const targetTabContent = this.el.nativeElement.querySelector(`.tab-contents#${tabName}`);

    if (clickedTabLink) {
      this.renderer.addClass(clickedTabLink, 'active-link');
    }

    if (targetTabContent) {
      this.renderer.addClass(targetTabContent, 'active-tab');
    }
  }
  getCourses(): void {
    this.blogService.findByTitle(this.searchTerm)
      .subscribe(blogs => {
        this.blogsList = blogs;
        this.filteredBlogs = this.blogsList;
      });
  }
  filterCourses(): any[] {
    if (!this.searchTerm) {
      this.filteredBlogs = this.blogsList;
    } else {
      this.filteredBlogs = this.blogsList.filter((course: any) =>
        Object.values(course).some(value =>
          value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
    return this.filteredBlogs || []; // Return the filtered courses or an empty array
  }

  deleteBlog(id: number): void {
    this.blogService.deleteBlog(id).subscribe(
      () => {
        console.log('Blog deleted successfully.');
        // Optionally, you can perform any other actions after deletion
        // For example, reload the list of blogs
        // this.loadBlogs();
        window.alert('Blog deleted successfully.');
        window.location.reload();
      },
      error => {
        console.error('Error deleting blog:', error);
        // Handle error appropriately, e.g., display error message
      }
    );
  }
}

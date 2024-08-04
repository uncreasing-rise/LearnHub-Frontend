
import {
  Component,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoursesService } from '../../api/services/courses/courses.service';
import { ElementRef, Renderer2 } from '@angular/core';
import { CategoryService } from '../../api/services/category/category.service';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  courseForm: FormGroup;
  coursesList: any[] = [];
  filteredCourses: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  activeTab: any = 'tab1';
  listLevels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  listCategory: any[] = [];
  selectedCategoryId: number | null = null;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private renderer: Renderer2,
    private el: ElementRef) {
    this.courseForm = this.fb.group({
      courseDTO: this.fb.group({
        courseTitle: ['', Validators.required],
        courseDes: ['', Validators.required],
        coursePrice: [null, Validators.required],
        category: this.fb.group({
          categoryId: ['', Validators.required],
          categoryName: ['', Validators.required]
        }),
        level: ['', Validators.required],
        tag: [''],
        courseDate: [this.getCurrentDateTime(), Validators.required],
        learningDetail: this.fb.group({
          objective: [''],
          benefit: ['']
        }),
        status: [1, Validators.required],
        sections: this.fb.array([])
      }),
      articleFiles: [],
      videoFiles: [],
      videoTrial: File,
      imageFile: File,
    });
  }
  ngOnInit(): void {
    this.addSection();
    this.route.params.subscribe(params => {
      this.searchTerm = params['searchTerm'];
      this.getCourses();
    });
    this.getListCategory();
  }
  // Hàm này trả về thời gian hiện tại dưới dạng chuỗi định dạng ISO 8601
  getCurrentDateTime(): string {
    return new Date().toISOString();
  }

  getListCategory(): void {
    this.categoryService.getListCategory().subscribe(res => {
      this.listCategory = res;
    });
  }

  get sections(): FormArray {
    const courseDTO = this.courseForm.get('courseDTO') as FormGroup;
    return courseDTO.get('sections') as FormArray;
  }
  addSection(): void {
    const courseDTO = this.courseForm.get('courseDTO') as FormGroup;
    const sections = courseDTO.get('sections') as FormArray;
    sections.push(this.fb.group({
      sectionName: ['', Validators.required],
      articles: this.fb.array([]),
      videos: this.fb.array([]),
      quizzes: this.fb.array([this.createQuiz()])
    }));

  }
  createQuiz(): FormGroup {
    return this.fb.group({
      quizTitle: ['Quiz', Validators.required],
      questions: this.fb.array([this.createQuestion()])
    });
  }
  addQuiz(sectionIndex: number): void {
    const quizzes = (this.sections.at(sectionIndex).get('quizzes') as FormArray);
    quizzes.push(this.createQuiz());
  }
  createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      point: [null, Validators.required],
      answerDTOs: this.fb.array([
        this.createAnswer(false),
        this.createAnswer(true)
      ])
    });
  }
  addQuestion(sectionIndex: number, quizIndex: number): void {
    const questions = (this.sections.at(sectionIndex).get('quizzes') as FormArray)
      .at(quizIndex)
      .get('questions') as FormArray;
    questions.push(this.createQuestion());
  }
  createAnswer(isCorrect: boolean): FormGroup {
    return this.fb.group({
      answerText: ['', Validators.required],
      isCorrect: [isCorrect]
    });
  }
  addAnswer(sectionIndex: number, quizIndex: number, questionIndex: number): void {
    const answers = (((this.sections.at(sectionIndex).get('quizzes') as FormArray).at(quizIndex).get('questions') as FormArray).at(questionIndex).get('answerDTOs') as FormArray);
    answers.push(this.createAnswer(false)); // Thêm một câu trả lời mới vào danh sách
  }


  addArticle(sectionIndex: number, title: string): void {
    const articles = this.sections.at(sectionIndex).get('articles') as FormArray;
    articles.push(this.fb.group({
      title: [title, Validators.required] // Use the provided title
    }));
  }

  addVideo(sectionIndex: number, title: string): void {
    const videos = this.sections.at(sectionIndex).get('videos') as FormArray;
    videos.push(this.fb.group({
      title: [title, Validators.required] // Use the provided title
    }));
  }
  onFileSelected1(event: any, field: string): void {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      this.courseForm.patchValue({ [field]: files[0] });
    }
  }
  onFileSelected(event: any, field: string): void {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (field === 'videoFiles') {
          this.addVideo(this.sections.length - 1, file.name); // Add video with file name as title
        } else if (field === 'articleFiles') {
          this.addArticle(this.sections.length - 1, file.name);
        }
      }

      // Kiểm tra nếu giá trị của this.courseForm.value[field] là null hoặc undefined, gán một mảng rỗng
      if (!this.courseForm.value[field]) {
        this.courseForm.patchValue({ [field]: [] });
      }

      // Sau đó, thêm tệp vào mảng
      this.courseForm.patchValue({ [field]: this.courseForm.value[field].concat(Array.from(files)) });
    }
  }


  getArticleControls(sectionIndex: number): AbstractControl[] {
    const articles = this.sections.at(sectionIndex).get('articles') as FormArray;
    return articles.controls;
  }
  getVideoControls(sectionIndex: number): AbstractControl[] {
    const videos = this.sections.at(sectionIndex).get('videos') as FormArray;
    return videos.controls;
  }
  getQuizControls(sectionIndex: number): AbstractControl[] {
    const quizzes = this.sections.at(sectionIndex).get('quizzes') as FormArray;
    return quizzes.controls;
  }

  getQuestionControls(sectionIndex: number, quizIndex: number): AbstractControl[] {
    const questions = (this.sections.at(sectionIndex).get('quizzes') as FormArray).at(quizIndex).get('questions') as FormArray;
    return questions.controls;
  }

  getAnswerControls(sectionIndex: number, quizIndex: number, questionIndex: number): AbstractControl[] {
    const answers = ((this.sections.at(sectionIndex).get('quizzes') as FormArray).at(quizIndex).get('questions') as FormArray).at(questionIndex).get('answerDTOs') as FormArray;
    return answers.controls;
  }

  onSubmit(): void {
    const courseDTO = this.courseForm.value.courseDTO;
    const articleFiles = this.courseForm.value.articleFiles;
    const videoFiles = this.courseForm.value.videoFiles;
    const videoTrial = this.courseForm.value.videoTrial;
    const imageFile = this.courseForm.value.imageFile;


    const formData = new FormData();
    formData.append('courseDTO', new Blob([JSON.stringify(courseDTO)], {
      type: 'application/json'
    }));

    // Append article files if present
    if (articleFiles && articleFiles.length > 0) {
      for (const file of articleFiles) {
        formData.append('articleFiles', file);
      }
    }

    // Append video files if present
    if (videoFiles && videoFiles.length > 0) {
      for (const file of videoFiles) {
        formData.append('videoFiles', file);
      }
    }

    if (videoTrial) {
      formData.append('videoTrial', videoTrial);
    }

    if (imageFile) {
      formData.append('ImageFile', imageFile);
    }

    // Gửi yêu cầu POST đến server
    this.coursesService.createCourse(formData).subscribe(
      response => {
        console.log("", JSON.stringify([this.courseForm.value.courseDTO]));
        console.log("ImageFile:", imageFile);
        console.log("VideoTrial:", videoTrial);
        console.log("VideoFiles:", videoFiles);
        console.log("ArticleFiles:", articleFiles);
        console.log("Success:", response);
        window.alert('Course Added successfully.');
        window.location.reload();

      },
      error => {
        console.log("Error:", error);
      }
    );
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
    this.coursesService.findByTitle(this.searchTerm)
      .subscribe(courses => {
        this.coursesList = courses;
        this.filteredCourses = this.coursesList;
      });
  }
  filterCourses(): any[] {
    if (!this.searchTerm) {
      this.filteredCourses = this.coursesList;
    } else {
      this.filteredCourses = this.coursesList.filter((course: any) =>
        Object.values(course).some(value =>
          value && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
    return this.filteredCourses || []; // Return the filtered courses or an empty array
  }


  showAddCourseForm() {
    // Show the add course modal
    const addCourseModal = document.getElementById('addCourseModal');
    if (addCourseModal) {
      addCourseModal.style.display = 'block';
    }
  }
  deleteCourse(courseId: number): void {
    this.coursesService.deleteCourse(courseId)
      .subscribe(
        () => {
          console.log('Course deleted successfully.');
          window.alert('Course deleted successfully.');
          window.location.reload();
        },
        error => {
          console.error('Error deleting course:', error);
          // Handle error appropriately, e.g., display error message
        }
      );
  }
  
  
  saveCourse() {
    // Process and save the new course data
    // Close the modal after saving
    const addCourseModal = document.getElementById('addCourseModal');
    if (addCourseModal) {
      addCourseModal.style.display = 'none';
    }
  }
  pageChanged(event: any): void {
    this.currentPage = event.page;
  }


  
}
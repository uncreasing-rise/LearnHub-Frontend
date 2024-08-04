import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../api/services/courses/courses.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../comment.service';
import { AuthService } from '../../../api/services/auth/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WishlistService } from '../../../wishlist.service';
// Define the Comment interface
import { FormsModule } from '@angular/forms';
import { CommentDTO } from '../../../api/models/auth.model';
interface Comment {
  userId: number; // Assuming userId is of type number
  courseId: number; // Assuming courseId is of type number
  commentText: string;
  // Other properties of Comment interface
}
interface Course {
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  coursePrice: number;
  category: string | null;
  isPassed: boolean;
  courseDate: string;
  ratings: number | null;
  level: string;
  tag: string;
  userId: number | null;
  learningDetail: LearningDetail;
  image: string | null;
  videoTrial: string | null;
  status: number;
  sections: Section[];
  avgRating: number;
  countRating: number;
  categoryName: string;
}

interface LearningDetail {
  benefit: string;
  objective: string;
}

interface Section {
  sectionId: number;
  sectionName: string;
  course: any; // It might be better to define a Course reference type here
  articles: Article[];
  videos: Video[];
  quizzes: Quiz[];
}

interface Article {
  articleId: number;
  title: string;
  articleUrl: string;
}

interface Video {
  videoId: number;
  title: string;
  description: string;
  videoData: string;
  isTrial: boolean;
}

interface Quiz {
  quizId: number;
  title: string;
  questions: Question[];
}
export interface WishlistItem {
  courseId: number; // Assuming each wishlist item is associated with a course ID
  userId: number; // Assuming each wishlist item is associated with a user ID
  // Add other properties as needed
}

interface Question {
  questionId: number;
  text: string;
  point: number;
  answers: Answer[];
}

interface Answer {
  answerId: number;
  text: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class CoursesDetailComponent implements OnInit {
  selectedVideo: any;
  safeUrl: SafeResourceUrl | null = null;

  userInfo: any;
  age: any;
  phone: any;
  email: any;
  image: any;
  frame: any;
  facebook: any;
  comment: string = ''; // Biến comment để lưu nội dung comment
  userId: any
  courseId: any;
  quizId: any;
  courseDetail: Course | null = null; // Fix typo here
  courseList: any;
  cardItem: any = [];
  currentURL: string;
  commentList: any
  isInWishlist: boolean = false;

  constructor(private wishlistService: WishlistService, private sanitizer: DomSanitizer, private authService: AuthService, private commentService: CommentService, private route: ActivatedRoute, private coursesService: CoursesService, private router: Router) {
    this.currentURL = this.router.url;
  }
  loadComments() {
    this.coursesService.getCommentsForCourse(this.courseId).subscribe(comments => {
      this.commentList = comments;
    });
  }
  selectVideo(video: any) {
    const videoUrl = video.videoData;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    this.selectedVideo = video;
  }
  onSubmit(): void {

    console.log("userID", this.userInfo.id);
    console.log("course", this.courseId)
    // Assuming this.userId and this.courseId are properly initialized elsewhere
    if (!this.userInfo.id || !this.courseId) {

      console.error('User ID or Course ID not available.');
      return;
    }

    // Create a new CommentDTO object
    const newComment: CommentDTO = {
      userId: this.userInfo.id,
      courseId: this.courseId,
      commentText: this.comment
    };

    // Call the createComment method of commentService
    this.commentService.createComment(newComment).subscribe(
      (createdComment: CommentDTO) => {
        // Handle successful creation of the comment
        console.log('Comment created:', createdComment);
      },
      (error) => {
        // Handle error
        console.error('Error creating comment:', error);
      }
    );
  }
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      if (!isNaN(this.courseId)) {
        this.loadComments();
      } else {
        console.error('Invalid courseId:', params['id']);
      }
      // Assuming you retrieve userId from another route parameter or somewhere else
      this.userId = this.userInfo.id // Adjust accordingly based on where userId comes from
    });

    this.courseId = +this.route.snapshot.params['id']; // Convert to number using '+'
    this.getUserInfo();

    this.getCourseDetail();
    this.onSubmit();
    let url = this.currentURL;
    let storedCardItem: any = localStorage.getItem('cardItem');
    this.cardItem = JSON.parse(storedCardItem);
    this.checkIfInWishlist(this.courseId, this.userId);

    const storedIsInWishlist = localStorage.getItem('isInWishlist');
    if (storedIsInWishlist !== null) {
      this.isInWishlist = storedIsInWishlist === 'true';
    }
  }

  formatCoursePrice(price: number | undefined): string {
    if (price == null) return '';
    // Format the price to include commas and "VNĐ"
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  }

  // Method to add course to cart
  onAddtoCard(c: any) {
    const cardItem = JSON.stringify(c);

    if (this.cardItem && this.cardItem.length) {
      this.cardItem.push(JSON.parse(cardItem));
    } else {
      this.cardItem = [JSON.parse(cardItem)];
    }

    localStorage.setItem('cardItem', JSON.stringify(this.cardItem));
    window.location.reload()
  }
  navigateToQuiz(quizId: number): void {
    this.router.navigate(['/quiz', quizId]);
  }
  
  getCourseDetail(): void {
    this.coursesService.getCourseDetail(this.courseId).subscribe(
      (data: any) => {
        const courseDetail: Course = {
          courseId: data.courseID,
          courseTitle: data.courseTitle,
          courseDescription: data.courseDes,
          coursePrice: data.coursePrice,
          category: data.category,
          isPassed: data.isPassed,
          courseDate: data.courseDate,
          ratings: data.ratings,
          level: data.level,
          tag: data.tag,
          userId: data.userId,
          learningDetail: {
            benefit: data.learningDetail.benefit,
            objective: data.learningDetail.objective,
          },
          image: data.image,
          videoTrial: data.videoTrial,
          status: data.status,
          sections: data.sections.map((sectionData: any) => {
            const section: Section = {
              sectionId: sectionData.sectionId,
              sectionName: sectionData.sectionName,
              course: null, // You might need to assign the course reference here
              articles: sectionData.articles.map((articleData: any) => ({
                articleId: articleData.articleID,
                title: articleData.title,
                articleUrl: articleData.articleUrl
              })),
              videos: sectionData.videos.map((videoData: any) => ({
                videoId: videoData.videoId,
                title: videoData.title,
                description: videoData.description,
                videoData: videoData.videoData,
                isTrial: videoData.isTrial
              })),
              quizzes: sectionData.quizzes.map((quizData: any) => ({
                quizId: quizData.id,
                title: quizData.title,
                questions: quizData.questions.map((questionData: any) => ({
                  questionId: questionData.id,
                  text: questionData.text,
                  point: questionData.point,
                  answers: questionData.answers.map((answerData: any) => ({
                    answerId: answerData.id,
                    text: answerData.text,
                    isCorrect: answerData.correct
                  }))
                }))
              }))
            };
            return section;
          }),
          avgRating: data.avgRating,
          countRating: data.countRating,
          categoryName: data.categoryName
        };
        this.courseDetail = courseDetail;
        console.log('Course Detail:', this.courseDetail);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  addToWishlist(): void {
    // Create a WishlistItem object with the courseId
    const wishlistItem: WishlistItem = {
      courseId: this.courseId,
      userId: this.userInfo.id // Assuming the user ID will be assigned by the server or obtained from authentication
    };

    // Call the addToWishlist method from the wishlist service
    this.wishlistService.addToWishlist(wishlistItem)
      .subscribe(() => {
        // Update isInWishlist to true after successfully adding to wishlist
        this.isInWishlist = true;
      }, error => {
        console.error('Error adding to wishlist:', error);
        // Handle error appropriately, e.g., display error message
      });
  }
  checkIfInWishlist(courseId: number, userId: number): void {
    this.wishlistService.checkIfInWishlist(courseId, userId)
      .subscribe((isInWishlist: boolean) => {
        if (isInWishlist) {
          console.log('Course is in the wishlist');
          // Do something if the course is in the wishlist
          isInWishlist = true;
        } else {
          console.log('Course is not in the wishlist');
          // Do something if the course is not in the wishlist
          isInWishlist = false;
        }
      }, error => {
        console.error('Error checking wishlist:', error);
        // Handle error appropriately, e.g., display error message
      });
  }
  removeFromWishlist(courseId: number, userId: number): void {
    // Call the WishlistService to remove course from wishlist
    this.wishlistService.deleteFromWishlist(courseId, userId)
      .subscribe(() => {
        // Update isInWishlist to false after successfully removing from wishlist
        this.isInWishlist = false;
      }, error => {
        console.error('Error removing from wishlist:', error);
        // Handle error appropriately, e.g., display error message
      });
  }



}

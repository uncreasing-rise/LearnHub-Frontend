export class Auth {
  id?: any;
  email?: string;
  password?: string;
}

export class Courses {
  id?: any;
  name?: string | undefined;
  price?: string | undefined;
  type?: string | undefined;
  rate?: number | undefined;
  view?: number | undefined;
  image?: string | undefined;
  created_at?: string | undefined;
}
export class ResponeCourseDTO {
  id: any;
  name: string;
  price: string;
  type: string;
  rate: number;
  view: number;
  image: string;
  created_at: string;

  constructor(
    id: any,
    name: string,
    price: string,
    type: string,
    rate: number,
    view: number,
    image: string,
    created_at: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type;
    this.rate = rate;
    this.view = view;
    this.image = image;
    this.created_at = created_at;
  }
}
export class CourseDetail {
  constructor(
    public id?: any,
    public name?: string,
    public price?: string,
    public type?: string,
    public rate?: number,
    public view?: number,
    public image?: string,
    public created_at?: string,
    public sections?: Section[]
  ) {}
}
// comment.model.ts
export class Comment {
  userName: string;
  commentText: string;
  userImage: string;

  constructor(userName: string, commentText: string, userImage: string) {
    this.userName = userName;
    this.commentText = commentText;
    this.userImage = userImage;
  }
}
export class CommentDTO {
    public courseId: number;
    public commentText: string;
    public userId: number;


    constructor(courseId: number, commentText: string, userId: number) {
      this.courseId = courseId;
      this.commentText = commentText;
      this.userId = userId;
    }

}
export class WishlistItem {
  public courseId: number; // Assuming each wishlist item is associated with a course ID
  public userId: number; // Assuming each wishlist item is associated with a user ID

   constructor(id: number, courseId: number, userId: number) {
    this.courseId = courseId;
    this.userId = userId;
  }
}

export class WishlistItemDTO {
  public courseId: number;
  public userId: number;
  public courseTitle: string;
  public courseCategory: string;
  public courseImage: string;

  constructor(courseId: number, userId: number, courseTitle: string, courseCategory: string, courseImage: string) {
    this.courseId = courseId;
    this.userId = userId;
    this.courseTitle = courseTitle;
    this.courseCategory = courseCategory;
    this.courseImage = courseImage;
  }
}


export class Section {
  constructor(
    public sectionId?: number,
    public sectionName?: string,
    public articles?: Article[],
    public videos?: Video[],
    public quizzes?: Quiz[]
  ) {}
}

export class Article {
  constructor(
    public articleID?: number,
    public title?: string,
    public articleUrl?: string
  ) {}
}

export class Video {
  constructor(
    public videoId?: number,
    public title?: string,
    public description?: string,
    public videoData?: string,
    public isTrial?: boolean
  ) {}
}

export class Quiz {
  constructor(
    public quizId?: number,
    public totalPoint?: number,
    public quizTitle?: string,
    public question?: Question[]
  ) {}
}

export class Question {
  constructor(
    public id: number,
    public text: string,
    public point: number,
    public answers: Answer[]
  ) {}
}

export class Blog {
  constructor(
    public title: any,
    public description: any,
  ) {}
}

export interface Answer {
  id: number;
  text: string;
  correct: boolean;
}
export interface QuizAnswerResponse {
  status: string;
  payload: {
    id: number;
    userId: number;
    title: string;
    startTime: Date;
    endTime: Date;
    quizId: number;
    questionList: Question[];
    answerList: AnswerAttempt[];
    totalPoint: number;
    point: number;
  }[];
}
// answer-attempt.model.ts

export interface AnswerAttempt {
  attemptId: number;
  questionId: number;
  selectedAnswerId: number;
  correctAnswerId: number;
  // Add any other properties if necessary
}

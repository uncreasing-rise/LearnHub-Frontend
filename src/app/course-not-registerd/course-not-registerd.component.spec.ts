import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseNotRegisterdComponent } from './course-not-registerd.component';

describe('CourseNotRegisterdComponent', () => {
  let component: CourseNotRegisterdComponent;
  let fixture: ComponentFixture<CourseNotRegisterdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseNotRegisterdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourseNotRegisterdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

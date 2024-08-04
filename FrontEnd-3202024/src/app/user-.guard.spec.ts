import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

class UserGuardStub {} // Placeholder class for testing purposes

describe('UserGuard', () => {
  let guard: any; // Declare a variable to hold an instance of UserGuard or any other guard

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserGuardStub); // Instantiate the UserGuardStub using TestBed
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Check if the guard instance is created successfully
  });
});

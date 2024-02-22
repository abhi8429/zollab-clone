import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  // @ts-ignore
  let guard: authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(authGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

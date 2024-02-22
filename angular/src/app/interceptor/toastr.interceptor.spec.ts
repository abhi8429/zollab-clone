import {TestBed} from '@angular/core/testing';

import {ToastrInterceptor} from './toastr.interceptor';

describe('ToastrInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ToastrInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ToastrInterceptor = TestBed.inject(ToastrInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

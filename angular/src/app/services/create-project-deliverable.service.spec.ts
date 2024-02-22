import { TestBed } from '@angular/core/testing';

import { CreateProjectDeliverableService } from './create-project-deliverable.service';

describe('CreateProjectDeliverableService', () => {
  let service: CreateProjectDeliverableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateProjectDeliverableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

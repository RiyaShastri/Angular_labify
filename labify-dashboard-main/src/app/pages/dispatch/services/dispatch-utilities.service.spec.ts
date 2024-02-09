import { TestBed } from '@angular/core/testing';

import { DispatchUtilitiesService } from './dispatch-utilities.service';

describe('DispatchUtilitiesService', () => {
  let service: DispatchUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

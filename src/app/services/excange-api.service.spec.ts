import { TestBed } from '@angular/core/testing';

import { ExcangeApiService } from './excange-api.service';

describe('ExcangeApiService', () => {
  let service: ExcangeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcangeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

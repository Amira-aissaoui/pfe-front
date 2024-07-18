import { TestBed } from '@angular/core/testing';

import { TeaminfoService } from './teaminfo.service';

describe('TeaminfoService', () => {
  let service: TeaminfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeaminfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DroppedMsItemsService } from './dropped-ms-items.service';

describe('DroppedMsItemsService', () => {
  let service: DroppedMsItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DroppedMsItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

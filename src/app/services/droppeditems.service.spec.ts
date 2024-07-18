import { TestBed } from '@angular/core/testing';

import { DroppedItemsService } from './droppeditems.service';

describe('DroppeditemsService', () => {
  let service: DroppedItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DroppedItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UsersDataTransferService } from './users-data-transfer.service';

describe('UsersDataTransferService', () => {
  let service: UsersDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

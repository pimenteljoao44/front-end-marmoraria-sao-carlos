import { TestBed } from '@angular/core/testing';

import { GruposDataTransferService } from './grupos-data-transfer.service';

describe('GruposDataTransferService', () => {
  let service: GruposDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GruposDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

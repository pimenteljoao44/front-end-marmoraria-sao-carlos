import { TestBed } from '@angular/core/testing';

import { CidadeDataTransferService } from './cidade-data-transfer.service';

describe('CidadeDataTransferService', () => {
  let service: CidadeDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CidadeDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

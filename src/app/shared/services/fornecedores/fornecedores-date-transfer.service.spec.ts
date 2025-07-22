import { TestBed } from '@angular/core/testing';

import { FornecedoresDateTransferService } from './fornecedores-date-transfer.service';

describe('FornecedoresDateTransferService', () => {
  let service: FornecedoresDateTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FornecedoresDateTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

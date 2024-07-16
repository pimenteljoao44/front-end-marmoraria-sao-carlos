import { TestBed } from '@angular/core/testing';

import { ProdutoDataTransferService } from './produto-data-transfer.service';

describe('ProdutoDataTransferService', () => {
  let service: ProdutoDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

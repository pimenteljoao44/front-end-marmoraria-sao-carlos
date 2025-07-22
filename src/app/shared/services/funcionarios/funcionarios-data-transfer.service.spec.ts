import { TestBed } from '@angular/core/testing';

import { FuncionariosDataTransferService } from './funcionarios-data-transfer.service';

describe('FuncionariosDataTransferService', () => {
  let service: FuncionariosDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionariosDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ClientesDataTransferService } from './clientes-data-transfer.service';

describe('ClientesDataTransferService', () => {
  let service: ClientesDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

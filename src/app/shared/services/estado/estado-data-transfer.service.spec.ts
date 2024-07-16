import { TestBed } from '@angular/core/testing';

import { EstadoDataTransferService } from './estado-data-transfer.service';

describe('EstadoDataTransferService', () => {
  let service: EstadoDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import {OrdemServicoService} from "./ordem-de-servico.service";


describe('OrdemDeServicoService', () => {
  let service: OrdemServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdemServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

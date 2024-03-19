import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesTableComponent } from './clientes-table.component';

describe('ClientesTableComponent', () => {
  let component: ClientesTableComponent;
  let fixture: ComponentFixture<ClientesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesTableComponent]
    });
    fixture = TestBed.createComponent(ClientesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

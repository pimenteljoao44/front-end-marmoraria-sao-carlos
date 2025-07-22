import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaTableComponent } from './venda-table.component';

describe('VendaTableComponent', () => {
  let component: VendaTableComponent;
  let fixture: ComponentFixture<VendaTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendaTableComponent]
    });
    fixture = TestBed.createComponent(VendaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

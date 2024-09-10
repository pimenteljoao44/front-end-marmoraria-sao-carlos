import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraTableComponent } from './compra-table.component';

describe('CompraTableComponent', () => {
  let component: CompraTableComponent;
  let fixture: ComponentFixture<CompraTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraTableComponent]
    });
    fixture = TestBed.createComponent(CompraTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

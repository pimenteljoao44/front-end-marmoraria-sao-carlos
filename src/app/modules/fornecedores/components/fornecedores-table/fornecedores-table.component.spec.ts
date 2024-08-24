import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedoresTableComponent } from './fornecedores-table.component';

describe('FornecedoresTableComponent', () => {
  let component: FornecedoresTableComponent;
  let fixture: ComponentFixture<FornecedoresTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FornecedoresTableComponent]
    });
    fixture = TestBed.createComponent(FornecedoresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

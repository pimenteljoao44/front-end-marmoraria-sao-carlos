import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedoresViewComponent } from './fornecedores-view.component';

describe('FornecedoresViewComponent', () => {
  let component: FornecedoresViewComponent;
  let fixture: ComponentFixture<FornecedoresViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FornecedoresViewComponent]
    });
    fixture = TestBed.createComponent(FornecedoresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

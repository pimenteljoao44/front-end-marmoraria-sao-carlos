import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraFormComponent } from './compra-form.component';

describe('CompraFormComponent', () => {
  let component: CompraFormComponent;
  let fixture: ComponentFixture<CompraFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraFormComponent]
    });
    fixture = TestBed.createComponent(CompraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraHomeComponent } from './compra-home.component';

describe('CompraHomeComponent', () => {
  let component: CompraHomeComponent;
  let fixture: ComponentFixture<CompraHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraHomeComponent]
    });
    fixture = TestBed.createComponent(CompraHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraViewComponent } from './compra-view.component';

describe('CompraViewComponent', () => {
  let component: CompraViewComponent;
  let fixture: ComponentFixture<CompraViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraViewComponent]
    });
    fixture = TestBed.createComponent(CompraViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

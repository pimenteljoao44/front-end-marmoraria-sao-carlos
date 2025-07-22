import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaViewComponent } from './venda-view.component';

describe('VendaViewComponent', () => {
  let component: VendaViewComponent;
  let fixture: ComponentFixture<VendaViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendaViewComponent]
    });
    fixture = TestBed.createComponent(VendaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

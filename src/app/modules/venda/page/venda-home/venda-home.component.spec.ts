import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaHomeComponent } from './venda-home.component';

describe('VendaHomeComponent', () => {
  let component: VendaHomeComponent;
  let fixture: ComponentFixture<VendaHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendaHomeComponent]
    });
    fixture = TestBed.createComponent(VendaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaHomeComponent } from './projeto-home.component';

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

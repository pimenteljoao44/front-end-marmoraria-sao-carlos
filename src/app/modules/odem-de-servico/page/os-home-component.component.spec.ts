import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsHomeComponentComponent } from './os-home-component.component';

describe('OsHomeComponentComponent', () => {
  let component: OsHomeComponentComponent;
  let fixture: ComponentFixture<OsHomeComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsHomeComponentComponent]
    });
    fixture = TestBed.createComponent(OsHomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

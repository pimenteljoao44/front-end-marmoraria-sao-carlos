import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsFormComponent } from './os-form.component';

describe('OsFormComponent', () => {
  let component: OsFormComponent;
  let fixture: ComponentFixture<OsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsFormComponent]
    });
    fixture = TestBed.createComponent(OsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

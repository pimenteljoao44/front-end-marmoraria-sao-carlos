import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsViewComponent } from './os-view.component';

describe('OsViewComponent', () => {
  let component: OsViewComponent;
  let fixture: ComponentFixture<OsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsViewComponent]
    });
    fixture = TestBed.createComponent(OsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

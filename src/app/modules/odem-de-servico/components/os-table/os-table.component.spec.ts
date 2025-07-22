import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsTableComponent } from './os-table.component';

describe('OsTableComponent', () => {
  let component: OsTableComponent;
  let fixture: ComponentFixture<OsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsTableComponent]
    });
    fixture = TestBed.createComponent(OsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

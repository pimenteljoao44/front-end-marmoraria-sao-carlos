import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoTableComponent } from './grupo-table.component';

describe('GrupoTableComponent', () => {
  let component: GrupoTableComponent;
  let fixture: ComponentFixture<GrupoTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrupoTableComponent]
    });
    fixture = TestBed.createComponent(GrupoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

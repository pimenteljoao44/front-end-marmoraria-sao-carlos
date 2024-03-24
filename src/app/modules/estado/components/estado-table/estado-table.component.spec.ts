import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoTableComponent } from './estado-table.component';

describe('EstadoTableComponent', () => {
  let component: EstadoTableComponent;
  let fixture: ComponentFixture<EstadoTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadoTableComponent]
    });
    fixture = TestBed.createComponent(EstadoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

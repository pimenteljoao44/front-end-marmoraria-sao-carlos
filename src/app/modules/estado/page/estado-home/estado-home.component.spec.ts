import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoHomeComponent } from './estado-home.component';

describe('EstadoHomeComponent', () => {
  let component: EstadoHomeComponent;
  let fixture: ComponentFixture<EstadoHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstadoHomeComponent]
    });
    fixture = TestBed.createComponent(EstadoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

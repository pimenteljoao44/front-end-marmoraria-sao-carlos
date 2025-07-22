import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionariosFormComponent } from './funcionarios-form.component';

describe('FuncionariosFormComponent', () => {
  let component: FuncionariosFormComponent;
  let fixture: ComponentFixture<FuncionariosFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuncionariosFormComponent]
    });
    fixture = TestBed.createComponent(FuncionariosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

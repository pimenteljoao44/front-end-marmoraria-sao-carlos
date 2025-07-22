import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionariosViewComponent } from './funcionarios-view.component';

describe('FuncionariosViewComponent', () => {
  let component: FuncionariosViewComponent;
  let fixture: ComponentFixture<FuncionariosViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuncionariosViewComponent]
    });
    fixture = TestBed.createComponent(FuncionariosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

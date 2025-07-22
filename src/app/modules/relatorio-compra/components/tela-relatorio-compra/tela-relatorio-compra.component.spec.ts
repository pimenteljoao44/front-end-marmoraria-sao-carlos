import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaRelatorioCompraComponent } from './tela-relatorio-compra.component';

describe('TelaRelatorioCompraComponent', () => {
  let component: TelaRelatorioCompraComponent;
  let fixture: ComponentFixture<TelaRelatorioCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelaRelatorioCompraComponent]
    });
    fixture = TestBed.createComponent(TelaRelatorioCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

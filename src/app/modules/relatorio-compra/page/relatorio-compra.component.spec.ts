import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioCompraComponent } from './relatorio-compra.component';

describe('RelatorioCompraComponent', () => {
  let component: RelatorioCompraComponent;
  let fixture: ComponentFixture<RelatorioCompraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioCompraComponent]
    });
    fixture = TestBed.createComponent(RelatorioCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

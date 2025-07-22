import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaRelatorioVendaComponent } from './tela-relatorio-venda.component';


describe('TelaRelatorioVendaComponent', () => {
  let component: TelaRelatorioVendaComponent;
  let fixture: ComponentFixture<TelaRelatorioVendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelaRelatorioVendaComponent]
    });
    fixture = TestBed.createComponent(TelaRelatorioVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

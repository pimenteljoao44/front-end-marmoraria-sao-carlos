import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarProjetoComponent } from './criar-projeto.component';

describe('CriarProjetoComponent', () => {
  let component: CriarProjetoComponent;
  let fixture: ComponentFixture<CriarProjetoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarProjetoComponent]
    });
    fixture = TestBed.createComponent(CriarProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasAReceber } from './contas-a-receber';

describe('ContasAReceber', () => {
  let component: ContasAReceber;
  let fixture: ComponentFixture<ContasAReceber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContasAReceber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasAReceber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

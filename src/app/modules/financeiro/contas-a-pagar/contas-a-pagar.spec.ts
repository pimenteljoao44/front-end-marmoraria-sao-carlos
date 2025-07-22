import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasAPagar } from './contas-a-pagar';

describe('ContasAPagar', () => {
  let component: ContasAPagar;
  let fixture: ComponentFixture<ContasAPagar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContasAPagar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasAPagar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

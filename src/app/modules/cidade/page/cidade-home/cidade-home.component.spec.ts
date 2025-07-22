import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadeHomeComponent } from './cidade-home.component';

describe('CidadeHomeComponent', () => {
  let component: CidadeHomeComponent;
  let fixture: ComponentFixture<CidadeHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CidadeHomeComponent]
    });
    fixture = TestBed.createComponent(CidadeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

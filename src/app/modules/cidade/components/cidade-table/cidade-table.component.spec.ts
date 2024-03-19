import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadeTableComponent } from './cidade-table.component';

describe('CidadeTableComponent', () => {
  let component: CidadeTableComponent;
  let fixture: ComponentFixture<CidadeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CidadeTableComponent]
    });
    fixture = TestBed.createComponent(CidadeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

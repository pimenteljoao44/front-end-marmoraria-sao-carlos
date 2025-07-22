import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadeViewComponent } from './cidade-view.component';

describe('CidadeViewComponent', () => {
  let component: CidadeViewComponent;
  let fixture: ComponentFixture<CidadeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CidadeViewComponent]
    });
    fixture = TestBed.createComponent(CidadeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

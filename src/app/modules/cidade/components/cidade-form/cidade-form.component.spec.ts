import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadeFormComponent } from './cidade-form.component';

describe('CidadeFormComponent', () => {
  let component: CidadeFormComponent;
  let fixture: ComponentFixture<CidadeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CidadeFormComponent]
    });
    fixture = TestBed.createComponent(CidadeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

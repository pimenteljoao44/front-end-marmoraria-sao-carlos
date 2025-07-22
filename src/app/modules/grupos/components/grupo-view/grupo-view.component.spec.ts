import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoViewComponent } from './grupo-view.component';

describe('GrupoViewComponent', () => {
  let component: GrupoViewComponent;
  let fixture: ComponentFixture<GrupoViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrupoViewComponent]
    });
    fixture = TestBed.createComponent(GrupoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

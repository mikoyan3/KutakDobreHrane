import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LozinkaComponent } from './lozinka.component';

describe('LozinkaComponent', () => {
  let component: LozinkaComponent;
  let fixture: ComponentFixture<LozinkaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LozinkaComponent]
    });
    fixture = TestBed.createComponent(LozinkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

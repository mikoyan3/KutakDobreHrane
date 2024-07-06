import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajrestoranComponent } from './dodajrestoran.component';

describe('DodajrestoranComponent', () => {
  let component: DodajrestoranComponent;
  let fixture: ComponentFixture<DodajrestoranComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodajrestoranComponent]
    });
    fixture = TestBed.createComponent(DodajrestoranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

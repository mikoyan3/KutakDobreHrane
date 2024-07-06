import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajkonobaraComponent } from './dodajkonobara.component';

describe('DodajkonobaraComponent', () => {
  let component: DodajkonobaraComponent;
  let fixture: ComponentFixture<DodajkonobaraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodajkonobaraComponent]
    });
    fixture = TestBed.createComponent(DodajkonobaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

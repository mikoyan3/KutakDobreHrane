import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzurirajprofilComponent } from './azurirajprofil.component';

describe('AzurirajprofilComponent', () => {
  let component: AzurirajprofilComponent;
  let fixture: ComponentFixture<AzurirajprofilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AzurirajprofilComponent]
    });
    fixture = TestBed.createComponent(AzurirajprofilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

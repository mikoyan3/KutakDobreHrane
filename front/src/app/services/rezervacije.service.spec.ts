import { TestBed } from '@angular/core/testing';

import { RezervacijeService } from './rezervacije.service';

describe('RezervacijeService', () => {
  let service: RezervacijeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RezervacijeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

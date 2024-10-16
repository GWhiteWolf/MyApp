import { TestBed } from '@angular/core/testing';

import { PasosService } from './pasos.service';

describe('PasosService', () => {
  let service: PasosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

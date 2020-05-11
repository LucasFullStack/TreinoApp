import { TestBed } from '@angular/core/testing';

import { TreinosService } from './treinos.service';

describe('TreinosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreinosService = TestBed.get(TreinosService);
    expect(service).toBeTruthy();
  });
});

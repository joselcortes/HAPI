import { TestBed } from '@angular/core/testing';

import { VigilanteHapiGuard } from './vigilante-hapi.guard';

describe('VigilanteHapiGuard', () => {
  let guard: VigilanteHapiGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VigilanteHapiGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

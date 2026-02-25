import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: () => {} } }
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

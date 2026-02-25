import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { adminGuard } from './admin.guard-guard';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: () => {} } },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

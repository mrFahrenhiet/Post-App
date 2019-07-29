import { TestBed } from '@angular/core/testing';

import { AuthIntersetterService } from './auth-intersetter.service';

describe('AuthIntersetterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthIntersetterService = TestBed.get(AuthIntersetterService);
    expect(service).toBeTruthy();
  });
});

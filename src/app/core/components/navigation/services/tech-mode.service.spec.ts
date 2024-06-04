import { TestBed } from '@angular/core/testing';

import { TechModeService } from './tech-mode.service';

describe('TechModeService', () => {
  let service: TechModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

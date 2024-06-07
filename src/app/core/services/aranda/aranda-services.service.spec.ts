import { TestBed } from '@angular/core/testing';

import { ArandaServicesService } from './aranda-services.service';

describe('ArandaServicesService', () => {
  let service: ArandaServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArandaServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

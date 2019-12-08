import { TestBed } from '@angular/core/testing';

import { ServiceAppService } from './service-app.service';

describe('ServiceAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceAppService = TestBed.get(ServiceAppService);
    expect(service).toBeTruthy();
  });
});

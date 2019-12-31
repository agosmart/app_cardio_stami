import { TestBed } from '@angular/core/testing';

import { SrvArchiveService } from './srv-archive.service';

describe('SrvArchiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SrvArchiveService = TestBed.get(SrvArchiveService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CommunityFundService } from './community-fund.service';

describe('CommunityFundService', () => {
  let service: CommunityFundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityFundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

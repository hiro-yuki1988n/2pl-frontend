import { TestBed } from '@angular/core/testing';

import { CommonFundService } from './common-fund.service';

describe('CommonFundService', () => {
  let service: CommonFundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonFundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

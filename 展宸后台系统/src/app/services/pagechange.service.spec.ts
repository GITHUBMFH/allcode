import { TestBed } from '@angular/core/testing';

import { PagechangeService } from './pagechange.service';

describe('PagechangeService', () => {
  let service: PagechangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagechangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

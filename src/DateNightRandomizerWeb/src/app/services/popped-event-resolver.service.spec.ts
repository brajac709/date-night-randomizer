import { TestBed } from '@angular/core/testing';

import { PoppedEventResolverService } from './popped-event-resolver.service';

describe('PoppedEventResolverService', () => {
  let service: PoppedEventResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoppedEventResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

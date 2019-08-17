import { TestBed } from '@angular/core/testing';

import { FacedetectapiService } from './facedetectapi.service';

describe('FacedetectapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacedetectapiService = TestBed.get(FacedetectapiService);
    expect(service).toBeTruthy();
  });
});

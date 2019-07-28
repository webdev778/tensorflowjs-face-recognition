import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRegistryComponent } from './face-registry.component';

describe('FaceRegistryComponent', () => {
  let component: FaceRegistryComponent;
  let fixture: ComponentFixture<FaceRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

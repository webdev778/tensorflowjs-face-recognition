import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraListComponent } from './camera-list.component';

describe('CameraListComponent', () => {
  let component: CameraListComponent;
  let fixture: ComponentFixture<CameraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

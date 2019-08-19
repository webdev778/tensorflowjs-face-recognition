import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraArrayComponent } from './camera-array.component';

describe('CameraArrayComponent', () => {
  let component: CameraArrayComponent;
  let fixture: ComponentFixture<CameraArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

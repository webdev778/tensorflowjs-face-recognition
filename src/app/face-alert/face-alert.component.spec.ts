import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceAlertComponent } from './face-alert.component';

describe('FaceAlertComponent', () => {
  let component: FaceAlertComponent;
  let fixture: ComponentFixture<FaceAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

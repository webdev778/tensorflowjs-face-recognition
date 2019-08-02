import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamDashboardComponent } from './webcam-dashboard.component';

describe('WebcamDashboardComponent', () => {
  let component: WebcamDashboardComponent;
  let fixture: ComponentFixture<WebcamDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcamDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

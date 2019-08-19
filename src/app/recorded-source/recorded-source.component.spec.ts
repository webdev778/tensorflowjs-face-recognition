import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedSourceComponent } from './recorded-source.component';

describe('RecordedSourceComponent', () => {
  let component: RecordedSourceComponent;
  let fixture: ComponentFixture<RecordedSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordedSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordedSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

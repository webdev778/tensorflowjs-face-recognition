import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedObjectsComponent } from './identified-objects.component';

describe('IdentifiedObjectsComponent', () => {
  let component: IdentifiedObjectsComponent;
  let fixture: ComponentFixture<IdentifiedObjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifiedObjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiedObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

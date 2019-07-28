import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRegistryComponent } from './vehicle-registry.component';

describe('VehicleRegistryComponent', () => {
  let component: VehicleRegistryComponent;
  let fixture: ComponentFixture<VehicleRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

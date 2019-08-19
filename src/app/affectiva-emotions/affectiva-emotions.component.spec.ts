import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectivaEmotionsComponent } from './affectiva-emotions.component';

describe('AffectivaEmotionsComponent', () => {
  let component: AffectivaEmotionsComponent;
  let fixture: ComponentFixture<AffectivaEmotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectivaEmotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectivaEmotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

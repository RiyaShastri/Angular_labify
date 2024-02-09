import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDriversDetailsComponent } from './track-drivers-details.component';

describe('TrackDriversDetailsComponent', () => {
  let component: TrackDriversDetailsComponent;
  let fixture: ComponentFixture<TrackDriversDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackDriversDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDriversDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDriversMapComponent } from './track-drivers-map.component';

describe('TrackDriversMapComponent', () => {
  let component: TrackDriversMapComponent;
  let fixture: ComponentFixture<TrackDriversMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackDriversMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDriversMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

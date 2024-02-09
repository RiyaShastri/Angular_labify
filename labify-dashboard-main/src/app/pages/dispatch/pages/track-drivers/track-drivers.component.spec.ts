import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDriversComponent } from './track-drivers.component';

describe('TrackDriversComponent', () => {
  let component: TrackDriversComponent;
  let fixture: ComponentFixture<TrackDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackDriversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverScheduleComponent } from './driver-schedule.component';

describe('DriverScheduleComponent', () => {
  let component: DriverScheduleComponent;
  let fixture: ComponentFixture<DriverScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

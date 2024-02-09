import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAddressScheduleComponent } from './doctor-address-schedule.component';

describe('DoctorAddressScheduleComponent', () => {
  let component: DoctorAddressScheduleComponent;
  let fixture: ComponentFixture<DoctorAddressScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAddressScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAddressScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAddressDetailsComponent } from './doctor-address-details.component';

describe('DoctorAddressDetailsComponent', () => {
  let component: DoctorAddressDetailsComponent;
  let fixture: ComponentFixture<DoctorAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAddressDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

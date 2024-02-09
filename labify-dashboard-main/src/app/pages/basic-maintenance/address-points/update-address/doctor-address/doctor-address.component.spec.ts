import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAddressComponent } from './doctor-address.component';

describe('DoctorAddressComponent', () => {
  let component: DoctorAddressComponent;
  let fixture: ComponentFixture<DoctorAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

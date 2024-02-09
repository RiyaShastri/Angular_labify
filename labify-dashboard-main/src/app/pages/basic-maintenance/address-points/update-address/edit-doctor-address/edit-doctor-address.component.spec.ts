import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDoctorAddressComponent } from './edit-doctor-address.component';

describe('EditDoctorAddressComponent', () => {
  let component: EditDoctorAddressComponent;
  let fixture: ComponentFixture<EditDoctorAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDoctorAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDoctorAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

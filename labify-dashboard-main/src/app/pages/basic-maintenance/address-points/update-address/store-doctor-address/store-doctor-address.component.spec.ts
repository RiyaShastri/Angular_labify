import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDoctorAddressComponent } from './store-doctor-address.component';

describe('StoreDoctorAddressComponent', () => {
  let component: StoreDoctorAddressComponent;
  let fixture: ComponentFixture<StoreDoctorAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreDoctorAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreDoctorAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddressScheduleComponent } from './company-address-schedule.component';

describe('CompanyAddressScheduleComponent', () => {
  let component: CompanyAddressScheduleComponent;
  let fixture: ComponentFixture<CompanyAddressScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAddressScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAddressScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

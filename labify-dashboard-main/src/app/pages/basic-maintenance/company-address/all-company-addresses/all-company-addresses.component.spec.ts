import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCompanyAddressesComponent } from './all-company-addresses.component';

describe('AllCompanyAddressesComponent', () => {
  let component: AllCompanyAddressesComponent;
  let fixture: ComponentFixture<AllCompanyAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCompanyAddressesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCompanyAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

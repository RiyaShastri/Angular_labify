import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddressComponent } from './company-address.component';

describe('CompanyAddressComponent', () => {
  let component: CompanyAddressComponent;
  let fixture: ComponentFixture<CompanyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

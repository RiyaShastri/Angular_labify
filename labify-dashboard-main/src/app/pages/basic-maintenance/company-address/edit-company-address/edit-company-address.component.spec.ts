import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyAddressComponent } from './edit-company-address.component';

describe('EditCompanyAddressComponent', () => {
  let component: EditCompanyAddressComponent;
  let fixture: ComponentFixture<EditCompanyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCompanyAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompanyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

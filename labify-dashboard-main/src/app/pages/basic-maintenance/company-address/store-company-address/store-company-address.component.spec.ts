import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCompanyAddressComponent } from './store-company-address.component';

describe('StoreCompanyAddressComponent', () => {
  let component: StoreCompanyAddressComponent;
  let fixture: ComponentFixture<StoreCompanyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreCompanyAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCompanyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

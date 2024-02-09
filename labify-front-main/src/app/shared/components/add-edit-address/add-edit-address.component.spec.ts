import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAddressComponent } from './add-edit-address.component';

describe('AddEditAddressComponent', () => {
  let component: AddEditAddressComponent;
  let fixture: ComponentFixture<AddEditAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditAddressComponent]
    });
    fixture = TestBed.createComponent(AddEditAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPointsComponent } from './address-points.component';

describe('AddressPointsComponent', () => {
  let component: AddressPointsComponent;
  let fixture: ComponentFixture<AddressPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressPointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

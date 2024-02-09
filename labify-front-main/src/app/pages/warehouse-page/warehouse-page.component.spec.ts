import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousePageComponent } from './warehouse-page.component';

describe('WarehousePageComponent', () => {
  let component: WarehousePageComponent;
  let fixture: ComponentFixture<WarehousePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousePageComponent]
    });
    fixture = TestBed.createComponent(WarehousePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

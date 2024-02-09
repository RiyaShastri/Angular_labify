import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicMaintenanceComponent } from './basic-maintenance.component';

describe('BasicMaintenanceComponent', () => {
  let component: BasicMaintenanceComponent;
  let fixture: ComponentFixture<BasicMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicMaintenanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleOrdersComponent } from './schedule-orders.component';

describe('ScheduleOrdersComponent', () => {
  let component: ScheduleOrdersComponent;
  let fixture: ComponentFixture<ScheduleOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

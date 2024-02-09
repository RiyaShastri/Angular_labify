import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCancelOrdersComponent } from './update-cancel-orders.component';

describe('UpdateCancelOrdersComponent', () => {
  let component: UpdateCancelOrdersComponent;
  let fixture: ComponentFixture<UpdateCancelOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCancelOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCancelOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

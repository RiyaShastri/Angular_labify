import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOrdersComponent } from './assign-orders.component';

describe('AssignOrdersComponent', () => {
  let component: AssignOrdersComponent;
  let fixture: ComponentFixture<AssignOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

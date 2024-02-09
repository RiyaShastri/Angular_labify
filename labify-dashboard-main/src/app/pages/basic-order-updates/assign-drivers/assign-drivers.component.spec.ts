import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDriversComponent } from './assign-drivers.component';

describe('AssignDriversComponent', () => {
  let component: AssignDriversComponent;
  let fixture: ComponentFixture<AssignDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDriversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

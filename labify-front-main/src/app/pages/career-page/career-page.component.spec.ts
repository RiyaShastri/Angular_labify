import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPageComponent } from './career-page.component';

describe('CareerPageComponent', () => {
  let component: CareerPageComponent;
  let fixture: ComponentFixture<CareerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CareerPageComponent]
    });
    fixture = TestBed.createComponent(CareerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

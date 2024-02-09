import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOnDemandOrderComponent } from './place-on-demand-order.component';

describe('PlaceOnDemandOrderComponent', () => {
  let component: PlaceOnDemandOrderComponent;
  let fixture: ComponentFixture<PlaceOnDemandOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceOnDemandOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceOnDemandOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

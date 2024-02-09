import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicOrderUpdatesComponent } from './basic-order-updates.component';

describe('BasicOrderUpdatesComponent', () => {
  let component: BasicOrderUpdatesComponent;
  let fixture: ComponentFixture<BasicOrderUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicOrderUpdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicOrderUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkOrdersRecievedComponent } from './mark-orders-recieved.component';

describe('MarkOrdersRecievedComponent', () => {
  let component: MarkOrdersRecievedComponent;
  let fixture: ComponentFixture<MarkOrdersRecievedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkOrdersRecievedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkOrdersRecievedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

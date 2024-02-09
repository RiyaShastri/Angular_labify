import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreNewDriverComponent } from './store-new-driver.component';

describe('StoreNewDriverComponent', () => {
  let component: StoreNewDriverComponent;
  let fixture: ComponentFixture<StoreNewDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreNewDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreNewDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

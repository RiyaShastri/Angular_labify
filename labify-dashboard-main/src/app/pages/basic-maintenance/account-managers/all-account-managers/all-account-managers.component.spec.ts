import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAccountManagersComponent } from './all-account-managers.component';

describe('AllAccountManagersComponent', () => {
  let component: AllAccountManagersComponent;
  let fixture: ComponentFixture<AllAccountManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAccountManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAccountManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

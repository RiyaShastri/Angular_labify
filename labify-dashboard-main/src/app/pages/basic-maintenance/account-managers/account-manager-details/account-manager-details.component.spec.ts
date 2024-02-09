import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagerDetailsComponent } from './account-manager-details.component';

describe('AccountManagerDetailsComponent', () => {
  let component: AccountManagerDetailsComponent;
  let fixture: ComponentFixture<AccountManagerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountManagerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

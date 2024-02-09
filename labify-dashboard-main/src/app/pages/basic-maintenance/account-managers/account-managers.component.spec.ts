import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagersComponent } from './account-managers.component';

describe('AccountManagersComponent', () => {
  let component: AccountManagersComponent;
  let fixture: ComponentFixture<AccountManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

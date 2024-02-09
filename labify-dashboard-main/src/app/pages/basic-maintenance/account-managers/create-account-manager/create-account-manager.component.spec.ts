import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountManagerComponent } from './create-account-manager.component';

describe('CreateAccountManagerComponent', () => {
  let component: CreateAccountManagerComponent;
  let fixture: ComponentFixture<CreateAccountManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

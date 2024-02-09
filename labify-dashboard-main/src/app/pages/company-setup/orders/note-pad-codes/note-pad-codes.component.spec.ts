import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePadCodesComponent } from './note-pad-codes.component';

describe('NotePadCodesComponent', () => {
  let component: NotePadCodesComponent;
  let fixture: ComponentFixture<NotePadCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotePadCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotePadCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

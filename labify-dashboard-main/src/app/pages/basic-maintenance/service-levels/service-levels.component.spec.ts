import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLevelsComponent } from './service-levels.component';

describe('ServiceLevelsComponent', () => {
  let component: ServiceLevelsComponent;
  let fixture: ComponentFixture<ServiceLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceLevelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

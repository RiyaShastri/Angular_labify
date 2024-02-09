import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSectionComponent } from './map-section.component';

describe('MapSectionComponent', () => {
  let component: MapSectionComponent;
  let fixture: ComponentFixture<MapSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapSectionComponent]
    });
    fixture = TestBed.createComponent(MapSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlacePageComponent } from './market-place-page.component';

describe('MarketPlacePageComponent', () => {
  let component: MarketPlacePageComponent;
  let fixture: ComponentFixture<MarketPlacePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketPlacePageComponent]
    });
    fixture = TestBed.createComponent(MarketPlacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOrders } from './driver-orders';

describe('DriverOrders', () => {
  let component: DriverOrders;
  let fixture: ComponentFixture<DriverOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

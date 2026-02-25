import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productc } from './productc';

describe('Productc', () => {
  let component: Productc;
  let fixture: ComponentFixture<Productc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersotrComponent } from './ordersotr.component';

describe('OrdersotrComponent', () => {
  let component: OrdersotrComponent;
  let fixture: ComponentFixture<OrdersotrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersotrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersotrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

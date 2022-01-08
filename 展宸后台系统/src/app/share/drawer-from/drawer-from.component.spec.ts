import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerFromComponent } from './drawer-from.component';

describe('DrawerFromComponent', () => {
  let component: DrawerFromComponent;
  let fixture: ComponentFixture<DrawerFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawerFromComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

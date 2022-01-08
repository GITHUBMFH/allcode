import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagebgComponent } from './pagebg.component';

describe('PagebgComponent', () => {
  let component: PagebgComponent;
  let fixture: ComponentFixture<PagebgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagebgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagebgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LstindexComponent } from './lstindex.component';

describe('LstindexComponent', () => {
  let component: LstindexComponent;
  let fixture: ComponentFixture<LstindexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LstindexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LstindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

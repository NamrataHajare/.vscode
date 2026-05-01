import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FDashboard } from './fdashboard';

describe('FDashboard', () => {
  let component: FDashboard;
  let fixture: ComponentFixture<FDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

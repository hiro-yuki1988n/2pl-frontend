import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyDividendsComponent } from './yearly-dividends.component';

describe('YearlyDividendsComponent', () => {
  let component: YearlyDividendsComponent;
  let fixture: ComponentFixture<YearlyDividendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [YearlyDividendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyDividendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

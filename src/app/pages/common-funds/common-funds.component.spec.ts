import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFundsComponent } from './common-funds.component';

describe('CommonFundsComponent', () => {
  let component: CommonFundsComponent;
  let fixture: ComponentFixture<CommonFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonFundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

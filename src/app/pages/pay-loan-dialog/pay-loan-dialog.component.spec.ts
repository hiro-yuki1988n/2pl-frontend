import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLoanDialogComponent } from './pay-loan-dialog.component';

describe('PayLoanDialogComponent', () => {
  let component: PayLoanDialogComponent;
  let fixture: ComponentFixture<PayLoanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayLoanDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLoanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

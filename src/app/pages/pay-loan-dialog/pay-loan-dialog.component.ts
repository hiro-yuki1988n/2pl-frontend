import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-pay-loan-dialog',
  templateUrl: './pay-loan-dialog.component.html',
  styleUrl: './pay-loan-dialog.component.css'
})
export class PayLoanDialogComponent {
  payLoanForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PayLoanDialogComponent>,
    private loanService: LoanService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.payLoanForm = this.fb.group({
      loanId: ['', Validators.required],
      unpaidAmount: [0],
      amount: [0, Validators.required],
      payDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.loadLoanPayments(); 

    if (this.data) {
      this.payLoanForm.patchValue({
        loanId: this.data.id,
        unpaidAmount: this.data.unpaidAmount
      });
    }
  }

  // onSave(): void {
  //   if (this.payLoanForm.valid) {
  //     const rawForm = this.payLoanForm.value;

  //     // Format dates to 'yyyy-MM-dd' string
  //     const formattedLoanPay = {
  //       ...rawForm,
  //       payDate: this.formatDate(rawForm.payDate)
  //     };

  //     this.loanService.saveLoanPayment(formattedLoanPay).subscribe({
  //       next: () => this.dialogRef.close(true),
  //       error: err => alert('Failed to save loan payment: ' + err.message)
  //     });
  //   }
  // }

  onSave(): void {
  if (this.payLoanForm.valid) {
    const rawForm = this.payLoanForm.value;

    const formattedLoanPay = {
      loanId: rawForm.loanId,
      amount: rawForm.amount,
      payDate: this.formatDate(rawForm.payDate),
      description: rawForm.description
    };

    this.loanService.saveLoanPayment(formattedLoanPay).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => alert('Failed to save loan payment: ' + err.message)
    });
  }
}


  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

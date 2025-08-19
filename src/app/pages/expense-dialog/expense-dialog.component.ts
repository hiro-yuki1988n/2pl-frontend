import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpendituresService } from '../../services/expenditures.service';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrl: './expense-dialog.component.css'
})
export class ExpenseDialogComponent {
  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private expendituresService: ExpendituresService
  ) {
    this.expenseForm = this.fb.group({
      id: [null],
      amount: [0, Validators.required],
      dateIssued: ['', Validators.required],
      expenseType: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    if (this.data) {
      this.expenseForm.patchValue({
        amount: this.data.amount,
        dateIssued: this.data.dateIssued,
        expenseType: this.data.expenseType,
        description: this.data.description
      });
    }
  }

  onSave(): void {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.value;

      if (this.data?.id) {
        formData.id = this.data.id;
      }

      // Format tarehe kama ISO string kwa LocalDateTime
      formData.dateIssued = this.formatDateTimeToLocal(formData.dateIssued);

      this.expendituresService.saveExpenditure(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to save Expenditure!: ' + err.message)
      });
    }
  }

  formatDateTimeToLocal(date: any): string {
    const d = new Date(date);
    // Hakikisha ina format kamili ya ISO LocalDateTime (lakini bila timezone Z)
    return d.toISOString().slice(0, 19); // e.g., "2025-06-21T14:30:00"
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

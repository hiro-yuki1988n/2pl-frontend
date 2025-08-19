import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContributionService } from '../../services/contribution.service';

@Component({
  selector: 'app-insert-entry-fee',
  templateUrl: './insert-entry-fee.component.html',
  styleUrl: './insert-entry-fee.component.css'
})
export class InsertEntryFeeComponent {
  entryFeeForm: FormGroup;

  months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<InsertEntryFeeComponent>,
      private contributionService: ContributionService,
    ) {
      this.entryFeeForm = this.fb.group({
        amount: [0, Validators.required],
        year: ['', Validators.required],
        month: ['', Validators.required]
      });
    }
  
  
    ngOnInit(): void {

    }

  onCommit(): void {
  if (this.entryFeeForm.valid) {
    const { amount, year, month } = this.entryFeeForm.value;
    this.contributionService.insertEntryFeeContributions(amount, year, month).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => alert('Failed to save entry fee contribution: ' + err.message)
    });
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }

}

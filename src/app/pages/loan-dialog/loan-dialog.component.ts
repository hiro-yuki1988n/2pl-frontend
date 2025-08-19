import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanService } from '../../services/loan.service';
import { MemberService } from '../../services/member.service';

interface Member {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-loan-dialog',
  templateUrl: './loan-dialog.component.html',
  styleUrl: './loan-dialog.component.css'
})
export class LoanDialogComponent { 
  loanForm: FormGroup;
  members: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private dialogRef: MatDialogRef<LoanDialogComponent>,
    private memberService: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.loanForm = this.fb.group({
      memberId: ['', Validators.required],
      amount: [0, Validators.required],
      interestRate: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMembers();

    if (this.data) {
      this.loanForm.patchValue({
        memberId: this.data.member?.id || this.data.memberId, // depending on your data structure
        amount: this.data.amount,
        interestRate: this.data.interestRate,
        startDate: this.data.startDate,
        dueDate: this.data.dueDate
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
    });
  }

  onSave(): void {
    if (this.loanForm.valid) {
      const formData = this.loanForm.value;
      if (this.data?.id) {
        formData.id = this.data.id; // Update 
      }

      const formattedLoan = {
        ...formData,
        startDate: this.formatDate(formData.startDate),
        dueDate: this.formatDate(formData.dueDate)
      };

      this.loanService.saveLoan(formattedLoan).subscribe({
        next: () => this.dialogRef.close(true),
        
        error: err => alert('Failed to save Loan!: ' + err.message)
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
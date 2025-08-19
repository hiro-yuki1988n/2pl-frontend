import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';
import { ContributionService } from '../../services/contribution.service';

interface Member {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-dividend-dialog',
  templateUrl: './dividend-dialog.component.html',
  styleUrl: './dividend-dialog.component.css'
})
export class DividendDialogComponent {
  dividendForm: FormGroup;
  members: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DividendDialogComponent>,
    private memberService: MemberService,
    private contributionService: ContributionService,
    @Inject(MAT_DIALOG_DATA) public data: { memberId: number; memberName: string; allocatedAmount: number },
  ) {
    this.dividendForm = this.fb.group({
      memberId: ['', Validators.required],
      allocatedAmount: [0, Validators.required],
      withdrawnAmount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadMembers();

    if (this.data) {
      this.dividendForm.patchValue({
        memberId: this.data.memberId,
        allocatedAmount: this.data.allocatedAmount,
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
    });
  }

  onSave(): void {
    if (this.dividendForm.valid) {
      const formData = this.dividendForm.value;

      if (formData.withdrawnAmount > formData.allocatedAmount) {
        alert('Withdrawn amount cannot exceed allocated amount!');
        return;
      }

      // Tuma tu fields zinazokubalika kwenye GraphQL input
      const cleanedData = {
        memberId: formData.memberId,
        withdrawnAmount: formData.withdrawnAmount
      };

      this.contributionService.saveYearlyDividend(cleanedData).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to save dividend: ' + err.message)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFundService } from '../../services/common-fund.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-fund-dialog',
  templateUrl: './common-fund-dialog.component.html',
  styleUrl: './common-fund-dialog.component.css'
})
export class CommonFundDialogComponent {
CommonFundForm: FormGroup;
sourceTypes = [
    'social_fund', 'penalty', 'member_left_over', 'interest'
  ];

  constructor(
    private fb: FormBuilder,
    private commonFundService: CommonFundService,
    private dialogRef: MatDialogRef<CommonFundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.CommonFundForm = this.fb.group({
      amount: [0, Validators.required],
      sourceType: ['', Validators.required],
      entryDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.loadMembers();

    if (this.data) {
      this.CommonFundForm.patchValue({
        commonFundId: this.data.commonFundId,
        amount: this.data.amount,
        sourceType: this.data.sourceType,
        entryDate: this.data.entryDate,
        description: this.data.description
      });
    }
  }

  // loadMembers(): void {
  //   this.memberService.getMembers().subscribe((result: any) => {
  //     this.members = result.data.getMkobaMembers.data;
  //   });
  // }

  onSave(): void {
    if (this.CommonFundForm.valid) {
      const formData = this.CommonFundForm.value;
      if (this.data?.id) {
        formData.id = this.data.id; // Update
      }

      const formattedFund = {
        ...formData,
        entryDate: this.formatDate(formData.entryDate)
      };

      this.commonFundService.saveCommonFund(formattedFund).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to save community fund!: ' + err.message)
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

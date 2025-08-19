import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityFundService } from '../../services/community-fund.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';

interface Member {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-community-fund-dialog',
  templateUrl: './community-fund-dialog.component.html',
  styleUrl: './community-fund-dialog.component.css'
})
export class CommunityFundDialogComponent {
  CommunityFundForm: FormGroup;
  members: Member[] = [];

  months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  constructor(
    private fb: FormBuilder,
    private communityFundService: CommunityFundService,
    private dialogRef: MatDialogRef<CommunityFundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private memberService: MemberService
  ) {
    this.CommunityFundForm = this.fb.group({
      memberId: ['', Validators.required],
      amount: [0, Validators.required],
      paymentDate: ['', Validators.required],
      month: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMembers();

    if (this.data) {
      this.CommunityFundForm.patchValue({
        memberId: this.data.memberId,
        amount: this.data.amount,
        paymentDate: this.data.paymentDate,
        month: this.data.month
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
    });
  }

  onSave(): void {
    if (this.CommunityFundForm.valid) {
      const formData = this.CommunityFundForm.value;
      if (this.data?.id) {
        formData.id = this.data.id; // Update
      }

      const formattedFund = {
        ...formData,
        paymentDate: this.formatDate(formData.paymentDate)
      };

      this.communityFundService.saveSocialFund(formattedFund).subscribe({
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

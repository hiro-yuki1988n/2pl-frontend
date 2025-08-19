import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContributionService } from '../../services/contribution.service';
import { MemberService } from '../../services/member.service';

interface Member {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-contribution-dialog',
  templateUrl: './contribution-dialog.component.html',
  styleUrl: './contribution-dialog.component.css'
})
export class ContributionDialogComponent {
  contributionForm: FormGroup; 
  members: Member[] = [];
  months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  contributionCategory = [
    'ENTRY_FEE', 'SHARE'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContributionDialogComponent>,
    private contributionService: ContributionService,
    private memberService: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.contributionForm = this.fb.group({
      memberId: ['', Validators.required],
      amount: [0, Validators.required],
      month: ['', Validators.required],
      contributionCategory: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadMembers();

    if (this.data) {
      this.contributionForm.patchValue({
        memberId: this.data.member?.id || this.data.memberId,
        amount: this.data.amount,
        month: this.data.month,
        contributionCategory: this.data.contributionCategory
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
    });
  }

  onSave(): void {
    if (this.contributionForm.valid) {
      const formData = this.contributionForm.value;
      if (this.data?.id) {
        formData.id = this.data.id; // Update
      }

      this.contributionService.saveContribution(this.contributionForm.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to save monthly member contribution: ' + err.message)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
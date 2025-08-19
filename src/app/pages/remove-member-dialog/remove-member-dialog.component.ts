import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';

interface Member {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-remove-member-dialog',
  templateUrl: './remove-member-dialog.component.html',
  styleUrl: './remove-member-dialog.component.css'
})
export class RemoveMemberDialogComponent {
removeMemberForm: FormGroup; 
  members: Member[] = [];

  removeReasons = [
    'death', 'cease', 'on_request'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RemoveMemberDialogComponent>,
    private memberService: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.removeMemberForm = this.fb.group({
      memberId: ['', Validators.required],
      removeReason: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.loadMembers();

    if (this.data) {
      this.removeMemberForm.patchValue({
        memberId: this.data.member?.id || this.data.memberId,
        removeReason: this.data.removeReason,
        // month: this.data.month,
        // contributionCategory: this.data.contributionCategory
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
    });
  }

  onSave(): void {
    if (this.removeMemberForm.valid) {
      const formData = this.removeMemberForm.value;
      if (this.data?.id) {
        formData.id = this.data.id; // Update
      }

      this.memberService.removeMember(this.removeMemberForm.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to remove member: ' + err.message)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.css'
})
export class CreateMemberComponent {
  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateMemberComponent>,
    private memberService: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      joiningDate: ['', Validators.required],
      memberRole: ['', Validators.required]
    });
  }

  // ngOnInit(): void {
  //   this.memberForm = this.fb.group({
  //     id: [this.data?.id || null],
  //     name: [this.data?.name || '', Validators.required],
  //     phone: [this.data?.phone || '', Validators.required],
  //     email: [{ value: this.data?.email || '', disabled: !!this.data?.id }, Validators.required],
  //     isAdmin: [this.data?.isAdmin || false],
  //     password: [''], // Only required for new members
  //     memberRole: [this.data?.memberRole || ''],
  //   });
  // }

  ngOnInit() {
  this.memberForm = this.fb.group({
    id: this.data.id,
    name: [this.data?.name || '', Validators.required],
    gender: [this.data?.name || '', Validators.required],
    email: [this.data?.email || '', [Validators.required, Validators.email]],
    phone: [this.data?.phone || '', Validators.required],
    joiningDate: [this.data?.name || '', Validators.required],
    memberRole: [this.data?.memberRole || '', Validators.required],
  });
}


  // onSave(): void {
  //   if (this.memberForm.valid) {
  //     this.memberService.saveMkobaMember(this.memberForm.value).subscribe({
  //       next: () => this.dialogRef.close(true),
  //       error: err => alert('Failed to save member: ' + err.message)
  //     });
  //   }
  // }

  onSave(): void {
    if (this.memberForm.valid) {
      const formData = this.memberForm.value;
      if (this.data?.id) {
        formData.id = this.data.id; // Update
      }

      const formattedDate = {
        ...formData,
        joiningDate: this.formatDate(formData.joiningDate)
      };

      this.memberService.saveMkobaMember(formattedDate).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to save member: ' + err.message)
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

import { Component, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from '../../services/member.service';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: number;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})

export class CreateUserComponent {
  userForm: FormGroup;
  members: Member[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private apollo: Apollo,
    private memberService: MemberService
  ) {
    this.userForm = this.fb.group({
      memberId: [null, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      // phoneNumber: [''],
      isAdmin: [false]
    });

  }

  ngOnInit(): void {
    this.loadMembers();

    if (this.data) {
      this.userForm.patchValue({
        memberId: this.data.member?.id || this.data.memberId, // depending on your data structure
        username: this.data.username,
        phone: this.data.member.phoneNumber,
        isAdmin: this.data.isAdmin
      });
    }
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe((result: any) => {
      this.members = result.data.getMkobaMembers.data;
    });
  }

  onMemberSelected(memberId: string): void {
    const selected = this.members.find(m => m.id === memberId);
    if (selected) {
      this.userForm.patchValue({
        username: selected.email,
        phoneNumber: selected.phone
      });
    }
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      if (this.data?.id) {
        formData.id = this.data.id;
      }

      this.userService.createUser(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: err => alert('Failed to save User!: ' + err.message)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

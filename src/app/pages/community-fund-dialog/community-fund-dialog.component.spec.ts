import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityFundDialogComponent } from './community-fund-dialog.component';

describe('CommunityFundDialogComponent', () => {
  let component: CommunityFundDialogComponent;
  let fixture: ComponentFixture<CommunityFundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityFundDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityFundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

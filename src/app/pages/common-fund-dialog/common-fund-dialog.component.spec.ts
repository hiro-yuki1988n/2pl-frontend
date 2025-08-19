import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFundDialogComponent } from './common-fund-dialog.component';

describe('CommonFundDialogComponent', () => {
  let component: CommonFundDialogComponent;
  let fixture: ComponentFixture<CommonFundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonFundDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

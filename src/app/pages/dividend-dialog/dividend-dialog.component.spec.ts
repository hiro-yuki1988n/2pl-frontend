import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendDialogComponent } from './dividend-dialog.component';

describe('DividendDialogComponent', () => {
  let component: DividendDialogComponent;
  let fixture: ComponentFixture<DividendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DividendDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

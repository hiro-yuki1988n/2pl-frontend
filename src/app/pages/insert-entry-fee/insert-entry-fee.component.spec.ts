import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertEntryFeeComponent } from './insert-entry-fee.component';

describe('InsertEntryFeeComponent', () => {
  let component: InsertEntryFeeComponent;
  let fixture: ComponentFixture<InsertEntryFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsertEntryFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertEntryFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

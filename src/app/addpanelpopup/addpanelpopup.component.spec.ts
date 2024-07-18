import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpanelpopupComponent } from './addpanelpopup.component';

describe('AddpanelpopupComponent', () => {
  let component: AddpanelpopupComponent;
  let fixture: ComponentFixture<AddpanelpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpanelpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpanelpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

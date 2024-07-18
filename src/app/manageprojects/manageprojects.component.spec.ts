import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageprojectsComponent } from './manageprojects.component';

describe('ManageprojectsComponent', () => {
  let component: ManageprojectsComponent;
  let fixture: ComponentFixture<ManageprojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageprojectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

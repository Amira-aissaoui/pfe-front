import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageprojectsDashComponent } from './manageprojectsDash.component';


import { importProvidersFrom } from '@angular/core';
import { ManageprojectsComponent } from '../manageprojects/manageprojects.component';

describe('ManageprojectsComponent', () => {
  let component: ManageprojectsDashComponent;
  let fixture: ComponentFixture <ManageprojectsDashComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageprojectsDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageprojectsDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

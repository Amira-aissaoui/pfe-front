import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScratchalertComponent } from './scratchalert.component';

describe('ScratchalertComponent', () => {
  let component: ScratchalertComponent;
  let fixture: ComponentFixture<ScratchalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScratchalertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScratchalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

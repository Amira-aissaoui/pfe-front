import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestalertComponent } from './testalert.component';

describe('TestalertComponent', () => {
  let component: TestalertComponent;
  let fixture: ComponentFixture<TestalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestalertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

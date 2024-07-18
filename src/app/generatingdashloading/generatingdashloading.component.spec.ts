import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingdashloadingComponent } from './generatingdashloading.component';

describe('GeneratingdashloadingComponent', () => {
  let component: GeneratingdashloadingComponent;
  let fixture: ComponentFixture<GeneratingdashloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingdashloadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratingdashloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

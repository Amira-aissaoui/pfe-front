import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedmetricssettingsComponent } from './advancedmetricssettings.component';

describe('AdvancedmetricssettingsComponent', () => {
  let component: AdvancedmetricssettingsComponent;
  let fixture: ComponentFixture<AdvancedmetricssettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedmetricssettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedmetricssettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

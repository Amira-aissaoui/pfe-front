import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailsettingsComponent } from './mailsettings.component';

describe('MailsettingsComponent', () => {
  let component: MailsettingsComponent;
  let fixture: ComponentFixture<MailsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailsettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

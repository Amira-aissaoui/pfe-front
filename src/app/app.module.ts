import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import these modules
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DndModule } from 'ngx-drag-drop';
import { AddalertComponent } from './addalert/addalert.component';
import { AddpanelpopupComponent } from './addpanelpopup/addpanelpopup.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DraftdndComponent } from './draftdnd/draftdnd.component';
import { DraggableIframeComponent } from './draggable-iframe/draggable-iframe.component';
import { EditdashboardComponent } from './editdashboard/editdashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaneleditComponent } from './paneledit/paneledit.component';
import { PopupMetricComponent } from './popupMetric/popupMetric.component';
import { PopupformComponent } from './popupform/popupform.component';
import { ScratchalertComponent } from './scratchalert/scratchalert.component';
import { TestalertComponent } from './testalert/testalert.component';
import { WidgetgrafanaComponent } from './widgetgrafana/widgetgrafana.component';


//----------------

import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
import { MatStepperModule } from '@angular/material/stepper';

import { NgApexchartsModule } from 'ng-apexcharts';





import { NgFor } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgPipesModule } from 'ngx-pipes';
import { AdministrationComponent } from './administration/administration.component';
import { AdvancedmetricssettingsComponent } from './advancedmetricssettings/advancedmetricssettings.component';
import { DialogComponent } from './dialog/dialog.component';
import { EditpermissionComponent } from './editpermission/editpermission.component';
import { GeneratingdashloadingComponent } from './generatingdashloading/generatingdashloading.component';
import { HomePageComponent } from './homePage/homePage.component';
import { LoadingComponent } from './loading/loading.component';
import { MailsettingsComponent } from './mailsettings/mailsettings.component';
import { ManageprojectsComponent } from './manageprojects/manageprojects.component';
import { ManageteamsComponent } from './manageteams/manageteams.component';
import { ManageusersComponent } from './manageusers/manageusers.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjecthomeeditComponent } from './projecthomeedit/projecthomeedit.component';
import { ProjectinfoComponent } from './projectinfo/projectinfo.component';
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';
import { RulesComponent } from './rules/rules.component';
import { AuthInterceptor } from './security/auth-interceptor';
import { UsersComponent } from './users/users.component';
import { ManageprojectsDashComponent } from './manageprojectsDash/manageprojectsDash.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,HomePageComponent,ManageprojectsDashComponent,
    PopupformComponent, LoginComponent,WidgetgrafanaComponent,DraggableIframeComponent, DashboardComponent, AlertsComponent, PageNotFoundComponent, AddpanelpopupComponent, EditdashboardComponent, PaneleditComponent, DraftdndComponent, ScratchalertComponent, Login2Component, TestalertComponent, AddalertComponent, MailsettingsComponent, ProfileComponent, AdvancedmetricssettingsComponent, DialogComponent, ProjectinfoComponent, AdministrationComponent, ManageprojectsComponent, EditpermissionComponent, ManageusersComponent, ManageteamsComponent, UsersComponent, ProjecthomeeditComponent, RulesComponent, ProjectsettingsComponent, LoadingComponent, GeneratingdashloadingComponent, PopupMetricComponent,
  ],
  imports: [
  MatDialogModule,MatIconModule,MatChipsModule,BrowserModule,
    BrowserAnimationsModule,FormsModule,ReactiveFormsModule,AppRoutingModule,
    DragDropModule,MatDialogModule,DndModule,HttpClientModule,NgApexchartsModule,
    MatProgressSpinnerModule,MatProgressBarModule,MatDatepickerModule,MatNativeDateModule,
    MatButtonModule,MatRadioModule,MatSnackBarModule,
    CanvasJSAngularChartsModule,MatTabsModule,  CommonModule,  NgxChartsModule,MatMenuModule,NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule
,NgFor,MatSelectModule,MatFormFieldModule,NgPipesModule,NgMultiSelectDropDownModule,MatSelectModule,
MatStepperModule,
MatInputModule,
MatPaginatorModule

  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],

  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

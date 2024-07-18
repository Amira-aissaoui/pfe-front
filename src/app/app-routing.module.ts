import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddalertComponent } from './addalert/addalert.component';
import { AddpanelpopupComponent } from './addpanelpopup/addpanelpopup.component';
import { AdministrationComponent } from './administration/administration.component';
import { AdvancedmetricssettingsComponent } from './advancedmetricssettings/advancedmetricssettings.component';
import { AlertsComponent } from './alerts/alerts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DraftdndComponent } from './draftdnd/draftdnd.component';
import { DraggableIframeComponent } from './draggable-iframe/draggable-iframe.component';
import { EditdashboardComponent } from './editdashboard/editdashboard.component';
import { EditpermissionComponent } from './editpermission/editpermission.component';
import { GeneratingdashloadingComponent } from './generatingdashloading/generatingdashloading.component';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './homePage/homePage.component';
import { LoadingComponent } from './loading/loading.component';
import { LoginComponent } from "./login/login.component";
import { Login2Component } from './login2/login2.component';
import { MailsettingsComponent } from './mailsettings/mailsettings.component';
import { ManageprojectsComponent } from './manageprojects/manageprojects.component';
import { ManageteamsComponent } from './manageteams/manageteams.component';
import { ManageusersComponent } from './manageusers/manageusers.component';
import { PaneleditComponent } from './paneledit/paneledit.component';
import { PopupMetricComponent } from './popupMetric/popupMetric.component';
import { PopupformComponent } from './popupform/popupform.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjecthomeeditComponent } from "./projecthomeedit/projecthomeedit.component";
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';
import { RulesComponent } from "./rules/rules.component";
import { ScratchalertComponent } from './scratchalert/scratchalert.component';
import { TestalertComponent } from './testalert/testalert.component';
import { UsersComponent } from './users/users.component';
import { ManageprojectsDashComponent } from './manageprojectsDash/manageprojectsDash.component';
const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'homePage', component : HomePageComponent},
    { path: 'popup', component: PopupformComponent },//same
    { path: 'popupM', component: PopupMetricComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'dragndrop', component: DraggableIframeComponent },
    { path: 'alert', component: AlertsComponent },
    { path: 'addpanelpopup', component: AddpanelpopupComponent },
    { path: 'editdash', component: EditdashboardComponent },//SAME
    { path: 'editpanel', component: PaneleditComponent },
    { path: 'draft',component:DraftdndComponent },
    { path: 'alertsracth', component: ScratchalertComponent },// ??
    { path: '', component: Login2Component }, //??
    { path: 'test', component: TestalertComponent }, //??
    { path: 'addalert', component: AddalertComponent },
    { path: 'mailsettings', component: MailsettingsComponent },//same interface
    { path: 'profile', component: ProfileComponent },
    { path: 'advancedsettings', component: AdvancedmetricssettingsComponent },
    { path: 'administration', component: AdministrationComponent },
    { path: 'manageprojects', component: ManageprojectsComponent },//same
    { path: 'editpermission', component: EditpermissionComponent },//same
    { path: 'manageteams', component: ManageteamsComponent },
    { path: 'manageusers', component: ManageusersComponent },
    { path: 'users', component: UsersComponent },
    { path: 'projectedit', component: ProjecthomeeditComponent },//same
    { path: 'rules', component: RulesComponent },//??
    { path: 'projectsettings', component: ProjectsettingsComponent },//same
    { path: 'loading', component: LoadingComponent },
    { path: 'generatingdash', component: GeneratingdashloadingComponent },


    {path: 'manageprojectsDash', component:ManageprojectsDashComponent}







  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

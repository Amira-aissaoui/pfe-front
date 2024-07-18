import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { ProjectDTO } from '../services/project.service';

interface AlertEmailInfo{
  alertname:string;
  instance:string;
  receiver:string;
  emails:string;
}


@Component({
  selector: 'app-mailsettings',
  templateUrl: './mailsettings.component.html',
  styleUrls: ['./mailsettings.component.css']
})
export class MailsettingsComponent {

projectName!:string;
ipAddressesArray!: string;
appType!: string;
nbms!: Number;
status = true;
ipAddresses!:string[];
AlertEmailInstances!:AlertEmailInfo[];
AllInstancesInformation: AlertEmailInfo[][] = [];
showInfo=false;
selectedReceiver: any = null;
isAddedClicked=false;
howmanytimesclicked=0;
emailstoFill!:string[];
editStates=false ;
isadded=false;
readonlyStates: boolean[] = [];
memberValues: string[] = [];
addDeleteInhibit=false;
//aandi mochkla fl delete, lezemni ndeliti zeda ml readonlyStates
addMember() {
  this.emails.push('');
  this.isAddedClicked=true;
  this.howmanytimesclicked+=1;
  console.log("this.readonlyStates"+this.readonlyStates);
  this.readonlyStates.push(false);
  this.memberValues.push('');

  console.log("memberValues"+this.memberValues[1]);
}

removeMember(index: number) {
  this.deleteMail(index);
  this.readonlyStates.splice(index, 1);
  console.log("this.readonlyStates"+this.readonlyStates);

  this.emails.splice(index, 1);
  console.log("this.readonlyStates"+this.emails);

  this.showDialog = false;


}
project!:ProjectDTO;
extractedIpAddr!:string[];

constructor(private dataService: DataService,private location: Location,private dialog: MatDialog,private router: Router, private http: HttpClient, private activatedRoute: ActivatedRoute) {}
  isUserManager!:string;
  ngOnInit() {

    this.project=this.dataService.getProject();
    this.projectName=this.project.projectName;
    this.ipAddressesArray=this.project.ipAddresses;
    this.appType=this.project.appType;
    this.extractedIpAddr=this.ipAddressesArray.split(",");
    this.nbms = this.extractedIpAddr.length;



    console.log("this.projectName" + this.projectName);
    console.log("this.appType" + this.appType);
    console.log("this.nbms" + this.nbms);
    console.log("this.addr" + this.ipAddressesArray);
    this.ipAddresses=this.ipAddressesArray.split(',');
    this.isUserManager=this.dataService.getUserInfo()?.user.role.toString()|| "";

    for(let i=0;i<this.ipAddresses.length;i++){
      console.log(" ip"+ this.ipAddresses[i]);

      this.getAlertsAndEmailsByInstance( this.ipAddresses[i]);
      console.log("okk")

    }
  }
  addToggle()
  {
    this.status = !this.status;
  }
  selectedItem: number = 2;
  selectItem(index: number): void {
    this.selectedItem = index;
  }
  goHome() {
    this.router.navigate(['/home']);
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getAlertsAndEmailsByInstance(instance: string) {
    const url = 'http://localhost:8080/api/alertmanager/get-instance-alert-details';

    this.http.get<AlertEmailInfo[]>(url, { params: { instance: instance } })
      .subscribe(
        (response: AlertEmailInfo[]) => {
          this.AlertEmailInstances = response;
          console.log("instance" + instance);
          console.log("this.AlertEmailInstances" + this.AlertEmailInstances[0].alertname);

          this.AllInstancesInformation.push(this.AlertEmailInstances); // Store data for current instance

          console.log("okay lena");
          console.log("ouwah" + this.AlertEmailInstances);
        },
        (error: any) => {
          console.error('Failed to retrieve alerts and emails:', error);
        }
      );
  }
  alertname!:string;
  instance!:string;
  emails!:string[];
  receiver!:string;
  showTeamInfo(receiver: any) {
    this.selectedReceiver = receiver;
    this.showInfo = true;
    console.log("selected"+this.selectedReceiver.alertname);
    this.alertname=this.selectedReceiver.alertname;
    this.instance=this.selectedReceiver.instance;
    this.emails=this.selectedReceiver.emails;
    this.receiver=this.selectedReceiver.receiver;
    console.log("alertname"+this.alertname);
    console.log("instance"+this.instance);
    console.log("emails"+this.emails[1]);
    this.howmanytimesclicked=0;
    this.emails.forEach(() => {
      this.readonlyStates.push(true); // Set the readonly state for existing members to true
    });

  }


  deleteMail(index:any){
    const toast = document.getElementById("toast-message")!;

   // console.log("fl delete"+this.emails[index]);
    const url = 'http://localhost:8080/api/alertmanager/delete-email-alert';
    const data={
      receiverName: this.receiver,
      receiverEmail: this.emails[index]
    }

    this.http.delete<any>(url, { params: data})
      .subscribe(
        (response) => {
          if(response){

            toast.innerHTML = "Team Member Mail Deleted!";
            toast.classList.add("toast-success");
            toast.classList.add("show");


          }
          else{

            toast.innerHTML = "Error Deleting the Team Member Mail!";
            toast.classList.add("toast-failed");
            console.error('Failed to change the State of the Alert.');

          }
        },
        (error: any) => {
          console.error('Failed to Delete the Mail:', error);
        }
      );
      setTimeout(() => {
        document.getElementById("toast-message")!.classList.remove("show");
      }, 1000);
      this.readonlyStates=[];
      this.refreshPage();
  }

  isInvalidFormat(): boolean {
    console.log("membervalues"+this.memberValues)
    return this.memberValues.some((email, index) => {
      const emailValue = this.memberValues[index];
      console.log("emailvalue"+this.memberValues);
      return !this.validateEmail(emailValue);
    });
  }
  validateEmail(email: string): boolean {
    // Use a regular expression or any other method to validate the email format
    // For example, you can use a simple regular expression like this:
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
  }
  // aandi bug saghrouna lena , when i add and then delete it pushes the value before
  saveChanges(){
    this.readonlyStates=[];

    const toast = document.getElementById("toast-message")!;
    var newmembers:string[]=[];
    const nbemails=this.memberValues.length;
    console.log("nbemails"+nbemails);
    if(this.isAddedClicked){
      for(let j=0;j<this.howmanytimesclicked;j++){
          newmembers.push(this.memberValues[nbemails-j-1]);
          console.log("this.emails[nbemails-j+1]"+this.memberValues[nbemails-j]);
          this.isadded=false;

        }
    }

    const url = 'http://localhost:8080/api/alertmanager/add-new-receiver';
    const data={
      receiverName: this.receiver,
      receiverEmails: newmembers
    }



    this.http.post<boolean>(url, null,{ params: data})
      .subscribe(
        (response) => {
          if(response){

            toast.innerHTML = "Team Member Mails Added!";
            toast.classList.add("toast-success");
            toast.classList.add("show");


          }
          else{

            toast.innerHTML = "Error Adding the Team Member Mail!";
            toast.classList.add("toast-failed");
            console.error('Failed to change the State of the Alert.');

          }
        },
        (error: any) => {
          console.error('Failed to Add the Mail:', error);
        }
      );
      setTimeout(() => {
        document.getElementById("toast-message")!.classList.remove("show");
      }, 1000);







    console.log("newmembers"+newmembers);
    this.isAddedClicked=false;
  this.howmanytimesclicked=0;
  this.refreshPage();

  }
  showDialog: boolean = false;

  openDialog() {
    this.showDialog = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = false;

    this.dialog.open(Dialog, dialogConfig);
  }
  closeDialog() {
    this.showDialog = false;

  }
  index!:number;
  indexInfoToDelete(index:number){
    this.index=index;
  }
  deleteConfirmation(){
  // console.log("this.ruleselected"+this.deleteruleselected.name);
    this.removeMember(this.index);

  }

  refreshPage() {

    location.reload();
    this.showInfo=true;

  }

}



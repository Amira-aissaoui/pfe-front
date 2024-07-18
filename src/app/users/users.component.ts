import { Dialog } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { timer } from 'rxjs';
import { UserinfoService } from '../services/userinfo.service';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
export interface User{
  firstname:string,
  lastname:string,
  role: string,
  email:string,
  password:string

}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  userForm: FormGroup;
  userToUpdate: User | null = null; 

  i=1;
  showPopup = false;
  status = true;
  nbprojet=0;
  numberPrometheusdown=0;
  numberGrafanadown=0;
  numberAlertManagerdown=0;
  isManageTeam:boolean=false;
  isManageProject:boolean=false;
  isTeamMemberSelected=false;
  isProjectSelected=false;

  constructor(private http: HttpClient,private router: Router,private dialog: MatDialog,private userInfoservice:UserinfoService,
    private snackBar: MatSnackBar	, private fb: FormBuilder) { 
      
      this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: [''] // Optional password field
    });
  }

    
  ngOnInit(): void {
    timer(3000);
    this.getUsersList();

  }
  getUser(user: User) {
    this.userToUpdate = user; // Store user for reference
    // New line for form pre-population:
    this.userForm.patchValue(user);
  }

  addToggle()
  {
    this.status = !this.status;
  }

    handleClose() {
      console.log("Popup closed");
    }
    goManageProject(){

    }
    goManageTeam(){

    }
    teamMemberSelected(){
      this.isTeamMemberSelected=!this.isTeamMemberSelected;
    }
    projectSelected(){
      this.isProjectSelected=!this.isProjectSelected;
    }
    manageProject(){
      this.isManageProject=!this.isManageProject;
    }
    goHome(){
      this.router.navigate(['/home']);
    }
    showEditDialog=false;
    editRole(){
      this.showEditDialog=!this.showEditDialog;
    }
    seeProjects=false;
    showProjects(){
      this.seeProjects=!this.seeProjects;
    }

    goBack(){
      this.seeProjects=!this.seeProjects;
    }
    showDialog2: boolean = false;
    openDialog2(): void {
     this.showDialog2 = true;
     const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = false;
    dialogConfig.panelClass = 'custom-dialog-panel'; // Add a custom CSS class to the dialog panel

    this.dialog.open(Dialog, dialogConfig);

   }


   closeDialog2() {
     this.showDialog2 = false;

   }
   showDialog3: boolean = false;
   openDialog3(): void {
    this.showDialog3 = true;
    const dialogConfig = new MatDialogConfig();
   dialogConfig.hasBackdrop = false;

   this.dialog.open(Dialog, dialogConfig);

  }


  closeDialog3() {
    this.showDialog3 = false;

  }
  showDialog4: boolean = false;
   openDialog4(): void {
    this.showDialog4 = true;
    const dialogConfig = new MatDialogConfig();
   dialogConfig.hasBackdrop = false;

   this.dialog.open(Dialog, dialogConfig);


  }


  closeDialog4() {
    this.showDialog4 = false;

  }
  showDialog5: boolean = false;
   openDialog5(): void {
    this.showDialog5 = true;
    const dialogConfig = new MatDialogConfig();
   dialogConfig.hasBackdrop = false;

   this.dialog.open(Dialog, dialogConfig);

  }


  closeDialog5() {
    this.showDialog5 = false;

  }
  createUser(){
    console.log("going");
  this.router.navigate(['/manageusers']);

  //  this.router.navigate(['/administration']);
}
usersList!:User[];
 getUsersList(){
  const url = 'http://localhost:8080/api/v1/users/users'; // Replace with your actual API endpoint

  this.http.get<any[]>(url)
    .subscribe(
      (response: any[]) => {

        this.usersList = response;

      },
      (error) => {
        // Handle the error here
        console.error(error);
      }
    );


}
newfirstname:string="";
newlastname:string="";
newrole:string="";
newemail:string="";
selectedRole:string="";
password:string="";
firstname:string="";
lastname:string="";
role:string="";
email:string="";
newpwd:string="";
oldemail:string="";









//getUser(user:User){
  //this.firstname=user.firstname;
  //this.lastname=user.lastname;
  //this.role=user.role;
  //this.email=user.email;
  //this.oldemail=user.email;

//}
editUser(){
  this.settingTheEditData();
  const userdata={
    firstname:this.firstname,
    lastname:this.lastname,
    email:this.email,
    role:this.role,
    password:this.newpwd
  }

  this.userInfoservice.updateUser(this.oldemail, userdata)
  .subscribe(
    (response: boolean) => {
      if (response) {
        console.log("updated");
        this.snackBar.open("Profile Update ", "Hide", {
          duration: 2000,
        });
          this.closeDialog2();
        timer(3000)
         this.refreshPage();

      } else {
        this.snackBar.open("Mail Address Already in use", "Hide", {
          duration: 2000,
        });
      }
    },
    (error) => {
      this.snackBar.open("Mail Address Already in use", "Hide", {
        duration: 2000,
      });
      this.closeDialog2();

      console.log("Error occurred");
    }
  );

  this.closeDialog2();



}
settingTheEditData(){
  if(this.password!=""){
    this.newpwd=this.password;
  }
  if(this.newfirstname!=""){
    this.firstname=this.newfirstname;
  }
  if(this.newlastname!=""){
    this.lastname=this.newlastname;
  }
  if(this.newemail!=""){
    this.email=this.newemail;
  }
  if(this.selectedRole){
    this.role=this.selectedRole.toUpperCase();
  }
}
emailToDelete:string="";
getSelectedEmail(email:string){
  this.emailToDelete=email;

}
  deleteUser(){
  this.userInfoservice.deleteUser(this.emailToDelete).subscribe(
    (response) => {

      return true;
    },
    (error) => {
      // Handle the error here
      console.error(error);
    }
  );
    this.refreshPage();
  }

  refreshPage() {

    location.reload();
  }
  logout(){
    this.userInfoservice.logout().subscribe(
      (response) => {
        console.log("ADIOS");
        this.router.navigate(["/"]);
  
  
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { interval } from 'rxjs';
import { HealthcheckService } from '../services/healthcheck.service';
import { timer } from 'rxjs';
import{DataService} from "../services/data-service.service";
import {UpdateProfileRequest, UserProjectsDTO} from "../services/userinfo.service";
import{UserinfoService} from "../services/userinfo.service";
import{AuthenticationRequest} from "../services/userinfo.service";
import{User} from "../services/userinfo.service";
import { MatSnackBar } from '@angular/material/snack-bar';

import { VERSION } from '@angular/core';


//--------------------
//Define the FileEvent type
type FileEvent = Event & { target: HTMLInputElement & { files: FileList } };



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {

  status = true;
  isUserManager:string="";
  isUserAdmin:string="";
  public editEnabled = true;
  public picurl: string = '';
  file: string = '';
  name = 'Angular ' + VERSION.major;
  url: any = '';

  constructor(private router: Router,private healthCheckService: HealthcheckService,private dataService:DataService,private snackBar: MatSnackBar,
              private userInfoService:UserinfoService) { }
  userInfo!: UserProjectsDTO |null;

  public clear() {
    this.picurl = '';
  }
  // profile image
  //handleUrlChange(event: Event) {
    //const target = event.target as HTMLInputElement;
    //if (target) {
      //this.picurl = target.value;
    //}
  //}




//**************
onFileChange(event: any) {
  const files = event.target.files as FileList;

  if (files.length > 0) {
    const _file = URL.createObjectURL(files[0]);
  this.file = _file;
    const reader = new FileReader();

    const file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.url = reader.result as string;
    // Store the image in the DataService
      // Store the image URL in localStorage
      localStorage.setItem('userProfil', this.url);
  };
}
}

onSelectFile(event: any) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.url = reader.result as string;
      // Save image URL to localStorage
      localStorage.setItem('userProfileImage', this.url);
      console.log('Image uploaded and saved:', this.url);
    };
  }
}

// declare the function before calling it
private resetInput() {
  const input = document.getElementById('avatar-input-file') as HTMLInputElement;
  if(input){
    input.value = "";
  }
}

ngOnInit(): void {
  this.isUserAdmin=this.dataService.getUserInfo()?.user.role.toString()|| "";

  if (this.dataService.getUserInfo() !== null) {
    this.userInfo = this.dataService.getUserInfo();
    if(this.userInfo){
      this.oldEmail=this.userInfo?.user.email;
      this.firstname=this.userInfo?.user.firstname;
      this.lastname=this.userInfo?.user.lastname;
      this.email=this.userInfo?.user.email;

      console.log(this.firstname);
    }

  }
  this.url = localStorage.getItem('userProfil');

}
firstname="";
lastname="";
password="";
newpassword="";
verifypassword="";
email="";
oldEmail="";
goHome(){
  this.router.navigate(['/home']);
}
goAdminsitration(){
  this.router.navigate(['/administration']);
}

addToggle()
{
  this.status = !this.status;
}

  handleClose() {
    console.log("Popup closed");
  }
  isEdit=false;
  isEditable=[false,false];
  editInformation(){
    this.isEdit=true;
  }

  editProfile() {
    if (this.newpassword !== this.verifypassword) {
      this.snackBar.open("Password Mismatch", "Hide", {
        duration: 2000,
      });
      return;
    }
  
    const user: User = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      role: "USER",
      password: this.newpassword,
    };
  
    const credentials: AuthenticationRequest = {
      email: this.oldEmail,
      password: this.password,
    };
  
    const updateProfileRequest: UpdateProfileRequest = {
      credentials: credentials,
      user: user,
    };
  
    this.userInfoService.updateProfile(updateProfileRequest).subscribe(
      (response) => {
        console.log("Profile updated");
        if (response == true) {
          this.snackBar.open("Profile updated", "Hide", {
            duration: 2000,
          });
        } else {
          this.snackBar.open("Profile Update Failed", "Hide", {
            duration: 2000,
          });
        }
      },
      (error) => {
        this.snackBar.open("Profile Update Failed", "Hide", {
          duration: 2000,
        });
        console.error('Profile update failed', error);
      }
    );
  
  }
}








import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserinfoService } from '../services/userinfo.service';
export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
}

enum Role {
  ADMIN = 'ADMIN',
  MANAGER='MANAGER',
  USER = 'USER'
  // Add more role values if needed
}

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageusersComponent {
  status = true;
  firstname: string="";
  lastname: string="";
  email: string="";
  password: string="";
  passwordverif: string="";
  role!: Role;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private userInfoservice:UserinfoService,private snackBar: MatSnackBar	
  ) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  goAdminsitration() {
    this.router.navigate(['/administration']);
  }

  addToggle() {
    this.status = !this.status;
  }

  handleClose() {
    console.log('Popup closed');
  }

  onRoleSelected(selectedValue: Role) {
    console.log('Selected Role:', selectedValue);
    this.role = selectedValue;
  }

  registerUser() {
    const request: RegisterRequest = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      role: this.role
    };
    if(this.firstname=="" || this.lastname=="" || this.email=="" || this.password ==""){
      this.snackBar.open("Please Check Fields", "Hide", {
        duration: 2000,
      });
    
    }
    else{
    if(this.password!=this.passwordverif){
      this.snackBar.open("Password Mismatch", "Hide", {
        duration: 2000,
      });


    }


else{


    const url = 'http://localhost:8080/api/v1/auth/register';
    this.http.post<any>(url, request).subscribe(
      response => {
        // Registration success
        console.log('Registration successful', response);
        // Handle the authentication response as needed
        this.goUsers();
      },
      error => {
        // Registration failed
        this.snackBar.open("Mail Address Already in Use", "Hide", {
          duration: 2000,
        });

        console.error('Registration failed', error);
        // Handle the error response as needed
      }
    );
  }}}
  goUsers(){
    this.router.navigate(['/users']);

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

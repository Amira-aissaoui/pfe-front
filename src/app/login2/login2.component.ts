import { Component } from '@angular/core';

import { Router } from "@angular/router";

import { HttpClient } from '@angular/common/http';

import { UserinfoService } from '../services/userinfo.service';


import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service.service';
import { UserProjectsDTO } from '../services/userinfo.service';



@Component({

  selector: 'app-login2',

  templateUrl: './login2.component.html',

  styleUrls: ['./login2.component.css']

})

export class Login2Component {

  password!:string;

  email!:string;
  userAdminStatus!:boolean;

//request: AuthenticationRequest = new AuthenticationRequest; auth control

  constructor(private router: Router, private http: HttpClient,private userInfoService:UserinfoService,private dataSerivce:DataService,
 private snackBar: MatSnackBar) { }

    userInfoInCase!:UserProjectsDTO;
    isUserAdmin(useremail: string) {
      this.getUserInfo(useremail).subscribe(
        (response) => {
          console.log("lena"+response )
          const userRole = response.user.role;
          this.userAdminStatus = userRole.toString() === "ADMIN";
          this.userInfoInCase=response;
        },
        (error) => {
          console.log("error"+error )

          this.userAdminStatus = false;
        }
      );
    }
    

    getUserInfo(email:string):Observable<UserProjectsDTO>{
      const url=`http://localhost:8080/api/v1/users/user/user_info/${email}`;
      return this.http.get<UserProjectsDTO>(url);
    }

  login() {

    const useremail = this.email;

    const userpwd = this.password;


    this.userInfoService.login(useremail, userpwd).subscribe(

      (response) => {

     
       
      
        const token = response.access_token;
        const refreshToken = response.refresh_token;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken); 
        console.log("token"+token )


        this.dataSerivce.setLoginEmail(useremail);

        this.isUserAdmin(useremail);
        console.log("lena2"+this.userAdminStatus )

        if(this.userAdminStatus ==true){
          this.dataSerivce.setUserInfo(this.userInfoInCase);

        }
        else{
          this.goToHomePage();

        }

      },

      (error) => {
        this.snackBar.open("Incorrect Credentials", "Hide", {
          duration: 2000,
        });

        console.error('Error:', error);
      }

    );

  }

  goToHomePage(): void {

    this.router.navigate(['/home']);
}





}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  logo = 'assets/logo-ok.png';
  
  loginForm = new FormGroup
  ({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLogin() {
    const { email, password } = this.loginForm.value;
    this.router.navigate(['./dashboard/listCustomer']);
    // try {
    //   const user = this.authSvc.login(email, password);
    //   if (user) {
    //     this.router.navigate(['./dashboard/categories']);
    //   }
    // }
    // catch {
    //   console.log("errro");
    // }
  }

}

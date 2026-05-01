// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// @Component({
//   selector: 'app-signup',
//   imports: [FormsModule],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css',
// })
// export class Signup {
//   name :String='';
//   gmail:string='';
//   password:string='';
//   role:string='';
//   department :string='';
//   constructor(private router:Router,private http:HttpClient){}
//   signup(){
//      this.http.post<any>('http://localhost:5000/api/signup',{name:this.name,gmail:this.gmail,password:this.password,department:this.department,role:this.role})
//      .subscribe({
//       next:(res)=>{
//         alert('Sign up sucessfully');
//         this.router.navigate(['login']);
//       },
//       error:(err)=>{
//         alert(err.message );
//         console.log(err);
//       }
//      })
//   }
//   login(){
//       this.router.navigate(['login']);
//   }
// }


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {
  name: string = '';
  gmail: string = '';
  password: string = '';
  department: string = '';
  showPassword: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  signup() {
    this.http.post<any>('http://localhost:5000/api/signup', {
      name: this.name,
      gmail: this.gmail,
      password: this.password,
      department: this.department
    }).subscribe({
      next: (res) => {
        alert('Sign up successful');
        this.router.navigate(['login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Signup failed');
        console.log(err);
      }
    });
  }

  login() {
    this.router.navigate(['login']);
 }
}
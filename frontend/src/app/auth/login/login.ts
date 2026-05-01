import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf,CommonModule],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router:Router,private http:HttpClient){}
  gmail: string = '';
  password:string='';
  showPassword: boolean = false;
   message: string = '';       
  messageColor: string = '';
  login(form: NgForm){
    if (form.invalid) {
    this.showMessage('All fields are mandatory', 'red'); // custom alert
    return;
  }
  console.log('enter');
   this.http.post<any>('http://localhost:5000/api/login',{gmail:this.gmail,password:this.password})
   .subscribe({
    next:(res)=>{
      const token = res.token;
      const role =res.role;
      const name =res.name;
      const dept = res.dept;
      localStorage.setItem('token',token);
      localStorage.setItem('role',role);
      localStorage.setItem('name', name);
      localStorage.setItem('dept_name', dept);
      console.log(dept);
      alert('login sucessfully');
      if(role=='student'){
        this.router.navigate(['/student/dashboard']);
      }
      else if (role=='faculty'){
        this.router.navigate(['/faculty/fdashbaord']);
      }
      else if(role === 'admin'){
        this.router.navigate(['/admin/admin']);
      }
    },
    error:(err)=>{
      alert(err);
    }
    
   })
  }
  signup(){
    console.log('recieved');
   this.router.navigate(['/signup']);
  }
    showMessage(msg: string, color: string) {
    this.message = msg;
    this.messageColor = color;

    setTimeout(() => this.message = '', 3000); 
  }
}

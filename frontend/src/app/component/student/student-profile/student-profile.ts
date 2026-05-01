import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-student-profile',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './student-profile.html',
})
export class StudentProfile implements OnInit {
  student: any = null;
  constructor(private http: HttpClient,private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    this.loadStudent();
  }

  loadStudent() {
    console.log('ptofile');
    const name = localStorage.getItem('name');
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:5000/api/student/${name}`, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
      next: (res) => {
        this.student = res;
        console.log('Student data:', this.student);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error fetching student:', err);
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-course.html'
})
export class StudentCourse implements OnInit {

  courses: any = null;
  enrolledCourses: any[] = [];

  token = localStorage.getItem('token');
  name = localStorage.getItem('name');

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadCourses();
    this.loadEnrolledCourses();
  }

  loadCourses() {
  
    this.http.get('http://localhost:5000/api/course',{headers:{Authorization:`Bearer ${this.token}`}})
      .subscribe((res: any) => {
        this.courses = res;
        this.cdr.detectChanges();
      });
  }

  loadEnrolledCourses() {
    this.http.get(`http://localhost:5000/api/enrollment/${this.name}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe((res: any) => {
      this.enrolledCourses = res;
      this.cdr.detectChanges();
    });
  }

  enroll(courseId: string) {
    console.log('enroll');
    this.http.post('http://localhost:5000/api/enrollment', {
      student_name: this.name,
      course_id: courseId
    }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe(() => {
      alert('Enrolled Successfully!');
      this.loadEnrolledCourses();
      this.cdr.detectChanges();
    });
  }
}

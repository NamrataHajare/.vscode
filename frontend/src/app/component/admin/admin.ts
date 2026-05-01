import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.html',
})
export class Admin {

  activeSection: string = 'addCourse';
  menuOpen: boolean = false;
  facultyList: any[] = [];
  courses: any[] = [];
  sections: any[] = [];

  course = {
    course_id: '',
    title: '',
    dept_name: '',
    credits: 0
  };

  assign = {
    dept_name: '',
    faculty_id: '',
    course_id: '',
    section_id: '',
    semester: 'Fall',
    year: new Date().getFullYear()
  };


  students: any[] = [];
  faculty: any[] = [];
 

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router
  ) { }

  setSection(section: string) {
    this.activeSection = section;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  addCourse() {
    const token = localStorage.getItem('token');
    this.http.post('http://localhost:5000/api/add-course', this.course, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        alert("Course Added")
        this.course = {
          course_id: '',
          title: '',
          dept_name: '',
          credits: 0
        };
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  onCourseChange() {
  const token = localStorage.getItem('token');
  this.assign.section_id = ''; 

  this.http.get<any[]>(
    `http://localhost:5000/api/sections-by-course/${this.assign.course_id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).subscribe(data => {
    this.sections = data;
  });
}

  onDepartmentChange() {

    this.assign.faculty_id = '';
    this.assign.course_id = '';
    this.assign.section_id = '';
   const token = localStorage.getItem('token');
    
    this.http.get<any[]>(
      `http://localhost:5000/api/faculty/${this.assign.dept_name}`, {
      headers: { Authorization: `Bearer ${token}` }}
    ).subscribe(data => {
      this.facultyList = data;
    });

    
    this.http.get<any[]>(
      `http://localhost:5000/api/courses/${this.assign.dept_name}`,{   headers: { Authorization: `Bearer ${token}` }}
    ).subscribe(data => {
      this.courses = data;
    });

    this.http.get<any[]>(
      `http://localhost:5000/api/sections/${this.assign.dept_name}`,{   headers: { Authorization: `Bearer ${token}` }}
    ).subscribe(data => {
      this.sections = data;
    });
  }

  assignFaculty() {
   const token = localStorage.getItem('token');
    this.http.post(
      'http://localhost:5000/api/assign-faculty',
      this.assign,{   headers: { Authorization: `Bearer ${token}` }}
    ).subscribe({
      next: () => {
        alert("Faculty Assigned Successfully");

        this.assign.faculty_id = '';
        this.assign.course_id = '';
        this.assign.section_id = '';
        this.assign.semester = 'Fall';
        this.assign.year = new Date().getFullYear();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }
  
  loadLists() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/api/all-data', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.students = res.students || [];
        this.faculty = res.faculty || [];
        this.courses = res.courses || [];
        this.cdr.detectChanges
      },
      error: (err) => console.error(err)
    });
  }

  switchTab(tab: string) {
    console.log('Switch to tab:', tab);
  }

  logout() {
    localStorage.clear();
    console.log('Logged out');
    this.router.navigate(['login']);
  }
}

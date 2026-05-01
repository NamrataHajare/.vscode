import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './Fdashboard.html',
  styleUrl: './Fdashboard.css',
})
export class FDashboard {
  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) { }
  Tab: string = "";
  menuOpen: boolean = false;
  timetable: any = null;
  activeTab: string = 'schedule';
  courses: any[] = [];
  selectedCourse: any = null;
  activeSection: string = '';
  students: any = null;
  faculty: any = null;
  result: any = 0.0;

  switchTab(tab: string) {
    this.Tab = tab;
    if (tab == 'profile') {
      this.router.navigate(['faculty/faculty-profile']);

      this.menuOpen = false;
    }
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    this.loadSchedule();
  }
  logout() {
    console.log('here');
    localStorage.clear();
    this.router.navigate(['login']);
  }

  loadCourse() {
    this.activeTab = 'courses';
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    console.log('Loading Courses...');

    this.http.get(
      `http://localhost:5000/api/courses/${name}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res: any) => {
        this.courses = res;
        console.log('Courses:', res);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  showSection(section: string) {
    this.activeSection = section;
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('dept_name');
    console.log(section);
    if (section === 'students') {

      this.http.get(`http://localhost:5000/api/studentlist/${name}`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({
          next: (res) => {
            this.students = res;
            this.cdr.detectChanges();

          },
          error: (err) => {
            console.log(err);
            alert("Error in loading try again.....");
          }
        });
    }
    else if (section === 'faculty') {
      this.http.get(`http://localhost:5000/api/facultylist/${name}`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({
          next: (res) => {
            this.faculty = res;
            this.cdr.detectChanges();

          },
          error: (err) => {
            console.log(err);
            alert("Error in loading try again.....");
          }
        });

    }
    else {
      this.http.get(`http://localhost:5000/api/result/${name}`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe({
          next: (res) => {
            this.result = res;
            this.cdr.detectChanges();

          },
          error: (err) => {
            console.log(err);
            alert("Error in loading try again.....");
          }
        });
    }

  }
  assignGrade(student: any, section: any, grade: string) {
    const token = localStorage.getItem('token');

    this.http.post(
      `http://localhost:5000/api/assign-grade`,
      {
        student_id: student.student_id,
        section_id: section.section_id,
        grade
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res) => {
        student.grade = grade;
        console.log(`Assigned grade ${grade} to ${student.name}`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error assigning grade:', err);
      }
    });
  }

  selectCourse(course: any) {
    this.selectedCourse = course;
  }

  loadSchedule() {
    this.activeTab = 'schedule';
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    console.log('schedule');
    this.http.get(
      `http://localhost:5000/api/schedule/${name}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (res: any) => {
        this.timetable = res;
        console.log("Timetable:", this.timetable);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log("Error:", err);
      }
    });
  }

  loadAbout() {
    this.activeTab = 'about';
    this.cdr.detectChanges();
  }

  loadDepartment() {
    this.activeTab = 'department';
    this.cdr.detectChanges();
  }
}

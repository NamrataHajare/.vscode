import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) { }
  activeTab: string = "";
  menuOpen: boolean = false;
  timetable: any = null;
  enrolledCourses:any=null;
  ngOnInit(){
   this.loadTimetable();
   this.loadEnrolledCourses();
  }
  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab == 'profile') {
      this.router.navigate(['student/student-profile']);

      this.menuOpen = false;
    }
    else if (tab == 'course') {

      this.router.navigate(['student/student-course']);
    }
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  loadTimetable() {
    
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    this.http.get(
      `http://localhost:5000/api/timetable/${name}`,
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

  loadEnrolledCourses() {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    this.http.get(`http://localhost:5000/api/enrollment/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe((res: any) => {
      this.enrolledCourses = res;
      this.cdr.detectChanges();
    });
  }
  logout() {
    console.log('here');
    localStorage.clear();
    this.router.navigate(['login']);
  }
}

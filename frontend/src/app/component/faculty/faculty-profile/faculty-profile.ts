import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-faculty-profile',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './faculty-profile.html',
  styleUrl: './faculty-profile.css',
})
export class FacultyProfile {

  faculty: any = null;
  constructor(private http: HttpClient,private cdr:ChangeDetectorRef) { }

  ngOnInit() {
    this.loadfaculty();
  }

  loadfaculty() {
    console.log('ptofile');
    const name = localStorage.getItem('name');
    const token = localStorage.getItem('token');
    this.http.get(`http://localhost:5000/api/faculty/${name}`, { headers: { Authorization: `Bearer ${token}` } }).subscribe({
      next: (res) => {
        this.faculty = res;
        console.log('faculty data:', this.faculty);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error fetching faculty:', err);
      },
    });
  }
}

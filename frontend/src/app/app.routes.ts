import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { authGuard } from './guard/auth-guard';
import { Dashboard } from './component/student/dashboard/dashboard';
import { StudentProfile } from './component/student/student-profile/student-profile';
import { StudentCourse } from './component/student/student-course/student-course';
import { FDashboard } from './component/faculty/dashboard/fdashboard';
import { FacultyProfile } from './component/faculty/faculty-profile/faculty-profile';
import { Admin } from './component/admin/admin';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'login',component:Login},
    {path:'signup',component:Signup},
    {path:'student/dashboard',component:Dashboard,canActivate:[authGuard]},
    {path:'student/student-profile',component:StudentProfile,canActivate:[authGuard]},
    {path:'student/student-course',component:StudentCourse,canActivate:[authGuard]},
    {path:'faculty/fdashbaord',component:FDashboard,canActivate:[authGuard]},
    {path:'faculty/faculty-profile',component:FacultyProfile,canActivate:[authGuard]},
    {path:'admin/admin',component:Admin,canActivate:[authGuard]}
];

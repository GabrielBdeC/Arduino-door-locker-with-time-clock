import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('../module/login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'door_locker_user',
    loadChildren: () =>
      import('../module/door-locker-user/door-locker-user.module').then(
        (m) => m.DoorLockerUserModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'application_user',
    loadChildren: () =>
      import('../module/application-user/application-user.module').then(
        (m) => m.ApplicationUserModule
      ),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/door_locker_user', pathMatch: 'full' },
  { path: '**', redirectTo: '/door_locker_user', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoorLockerUserComponent } from './door-locker-user.component';
import { DoorLockerUserService } from './service/door-locker-user.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DoorLockerUserComponent }
];

@NgModule({
  declarations: [
    DoorLockerUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    DoorLockerUserService
  ]
})
export class DoorLockerUserModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationUserComponent } from './application-user.component';
import { ApplicationUserService } from './service/application-user.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ApplicationUserComponent }
];

@NgModule({
  declarations: [
    ApplicationUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ApplicationUserService
  ]
})
export class ApplicationUserModule { }

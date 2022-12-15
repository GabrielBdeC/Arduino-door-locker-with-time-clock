import { AuthGuard } from './../../core/guard/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoorLockerUserComponent } from './door-locker-user.component';
import { DoorLockerUserService } from './service/door-locker-user.service';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './component/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';


const routes: Routes = [
  { path: '', component: DoorLockerUserComponent }
];

@NgModule({
  declarations: [
    DoorLockerUserComponent, TableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule
  ],
  providers: [
    DoorLockerUserService,
    AuthGuard
  ]

})
export class DoorLockerUserModule { }

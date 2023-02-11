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
import { DoorLockerUserModalComponent } from './component/modal/modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const routes: Routes = [
  { path: '', component: DoorLockerUserComponent }
];

@NgModule({
  declarations: [
    DoorLockerUserComponent,
    TableComponent,
    DoorLockerUserModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  providers: [
    DoorLockerUserService,
    AuthGuard
  ]

})
export class DoorLockerUserModule { }

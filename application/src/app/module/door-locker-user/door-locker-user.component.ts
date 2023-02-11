import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DoorLockerUserModalComponent } from './component/modal/modal.component';
import { TableComponent } from './component/table/table.component';

@Component({
  selector: 'app-door-locker-user',
  templateUrl: './door-locker-user.component.html',
  styleUrls: ['./door-locker-user.component.css'],
})
export class DoorLockerUserComponent {
  constructor(private dialog: MatDialog) { }

  @ViewChild(TableComponent) table: TableComponent;

  public openModal() {
    let modalRef = this.dialog
      .open(DoorLockerUserModalComponent)
      .afterClosed()
      .subscribe((data) => {
        if (data === 'success') {
          this.table.fetchData();
        }
      });
  }
}

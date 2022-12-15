import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DoorLockerUserService } from '../../service/door-locker-user.service';
import { DoorLockerUser, DoorLockerUserPaginated } from '../../model/door-locker-user.model';

type DoorLockerUserPaginatedMeta = Omit<DoorLockerUserPaginated, "items">

@Component({
  selector: 'app-door-locker-user-table',
  styleUrls: ['./table.component.css'],
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  displayedColumns = ['institutionCode', 'name', 'authorization'];
  metaData: DoorLockerUserPaginatedMeta = {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  };
  length: number = 0;
  dataSource: MatTableDataSource<DoorLockerUser>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private doorLockerUserService: DoorLockerUserService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<DoorLockerUser>();
    this.fetchData();
  }

  fetchData(numberPage: number | void, pageItems: number | void): void {
    this.doorLockerUserService.getAll(numberPage, pageItems).subscribe(
      (el: DoorLockerUserPaginated) => {
        this.dataSource.data = el.items;
        const { items, ...meta } = el;
        meta.currentPage -= 1;
        this.metaData = meta;
        this.length = meta.totalItems;
        console.log(this.length);
      }
    );
  }

  feiurinha() {
    console.log(this.length);
    this.metaData.totalItems = 23;
  }

  onPageEvent(ev: PageEvent) {
    //this.fetchData(ev.pageIndex + 1, ev.pageSize);
    this.length = ev.length;
    this.paginator.page
    //console.log(ev);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }*/
}

/** Builds and returns a new User. */
/* function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
  };
}

/** Constants used to fill up our data base. */
/* const COLORS = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray',
];
const NAMES = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
} */

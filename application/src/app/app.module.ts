import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './core/app-routing.module';
import { FooterModule } from './module/footer/footer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';

import { registerLocaleData, DatePipe } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './module/login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './module/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ModalComponent } from './module/modal/modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { TableComponent } from './module/table/table.component';
import { ModalWarningComponent } from './module/modal-warning/modal-warning.component';


registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent, LoginComponent, NavbarComponent, ModalComponent, TableComponent, ModalWarningComponent,],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FooterModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    NgbModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,

  ],
  providers: [

    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: "pt-BR"
    },
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR'
    },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

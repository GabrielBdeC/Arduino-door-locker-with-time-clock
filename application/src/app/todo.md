to do:

index.html:

-algumas coisas do angular material (material icons)

module.ts


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './core/app-routing.module';
import { CoreModule } from './core/code.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

app.module.ts


import { AuthService } from './core/service/auth.service';
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './core/app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';

import { registerLocaleData, DatePipe } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import localePt from '@angular/common/locales/pt';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/module/navbar/navbar.component';
import { FooterComponent } from './shared/module/footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ModalComponent } from './module/door-locker-user/component/modal/modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ModalWarningComponent } from './module/door-locker-user/component/modal-warning/modal-warning.component';


registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent, NavbarComponent, ModalComponent, ModalWarningComponent, FooterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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

    AuthService,

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

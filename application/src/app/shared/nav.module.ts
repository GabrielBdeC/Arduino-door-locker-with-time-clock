import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from './module/navbar/navbar.component';
import { FooterComponent } from './module/footer/footer.component';
import { AuthService } from './../core/service/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    NavbarComponent, FooterComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule


  ],
  providers: [
    AuthService,

  ],
  exports: [
    NavbarComponent, FooterComponent
  ]
})
export class NavModule { }

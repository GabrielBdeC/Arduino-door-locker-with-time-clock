import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';


@NgModule({
  imports: [HttpClientModule, BrowserAnimationsModule],
  providers: [AuthService, AuthGuard],
  exports: [BrowserAnimationsModule, HttpClientModule]
})
export class CoreModule { }

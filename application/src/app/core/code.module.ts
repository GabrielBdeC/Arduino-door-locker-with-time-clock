import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './guard/auth.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthService } from './service/auth.service';


@NgModule({
  imports: [HttpClientModule, BrowserAnimationsModule],
  providers: [
    AuthService,
    AuthGuard,
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  exports: [BrowserAnimationsModule, HttpClientModule]
})
export class CoreModule { }

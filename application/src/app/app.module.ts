import { AuthService } from './core/service/auth.service';
import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { NavModule } from './shared/nav.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NavModule,
    BrowserAnimationsModule
  ],
  providers: [

    AuthService,

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

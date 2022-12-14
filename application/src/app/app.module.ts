import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './core/app-routing.module';
import { AppComponent } from './app.component';
import { NavModule } from './shared/nav.module';
import { CoreModule } from './core/code.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NavModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

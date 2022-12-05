import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';


@NgModule({
  imports: [HttpClientModule],
  providers: [AuthService, AuthGuard],
  //exports: [AuthGuard]
})
export class CoreModule {}

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.url[0].path == 'login') {
      if (this.authService.getPayload()) {
        this.router.navigate(['']);
        return false;
      } else {
        return true;
      }
    } else {
      if (this.authService.getPayload()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}

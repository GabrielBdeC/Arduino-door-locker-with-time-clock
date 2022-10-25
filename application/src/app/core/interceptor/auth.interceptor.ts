import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const payload = this.authService.getPayload();
    if (this.authService.getPayload()) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

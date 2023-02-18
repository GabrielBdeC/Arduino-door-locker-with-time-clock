import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const payload = this.authService.getPayload();
    if (payload) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${payload.accessToken}`,
        },
      });
      return next.handle(cloned).pipe(
        catchError(
          (err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
              this.authService.logout();
              this.router.navigate(['login']);
              return EMPTY;
            }
            throw err;
          }
        )
      );
    } else {
      return next.handle(req);
    }
  }
}

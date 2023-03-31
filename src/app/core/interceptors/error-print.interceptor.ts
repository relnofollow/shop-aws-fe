import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error: unknown) => {
          const url = new URL(request.url);

          let statusCodeMessage = '';
          if (error instanceof HttpErrorResponse && error.status !== 0) {
            statusCodeMessage = ` STATUS CODE = ${error.status}.`;
          }

          this.notificationService.showError(
            `Request to "${url.pathname}" failed.${statusCodeMessage} Check the console for the details`,
            0
          );
        },
      })
    );
  }
}

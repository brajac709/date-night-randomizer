import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, finalize, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService : SpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;

    this.spinnerService.showSpinner(true);

    return next.handle(req)
      .pipe(
        finalize(() => {
          this.spinnerService.showSpinner(false);
        })
      );
  }
}
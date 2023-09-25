import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '../services/spinnerService';
import { finalize } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private spinnerService: SpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.spinnerService.show();
    const XRapidAPIKey = ""
    const XRapidAPIHost = "api-football-v1.p.rapidapi.com"

    const authReq = req.clone({
      setHeaders: {
        'X-RapidAPI-Key': XRapidAPIKey,
        'X-RapidAPI-Host': XRapidAPIHost
      }
    });

    return next.handle(authReq).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthIntersetterService implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
   const authToken = this.authService.token;
   const authRequest  = req.clone({
     headers: req.headers.set('authorization', 'Bearer ' + authToken)
   });
   return next.handle(authRequest);
  }
}

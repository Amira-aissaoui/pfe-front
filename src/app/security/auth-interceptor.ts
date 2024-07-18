import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    console.log("token"+token);
    if (token) {
      // Clone the request and add the token to the Authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("authRequest"+authRequest);

      return next.handle(authRequest);
    }

    // If no token, proceed with the original request
    return next.handle(request);
  }
}

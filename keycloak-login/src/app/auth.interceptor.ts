import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service or localStorage
    const authToken = localStorage.getItem('access_token');

    // Clone the request and set the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: authToken ? `Bearer ${authToken}` : ''
      }
    });

    // Log the request for debugging
    console.log('Intercepted HTTP Request:', authReq);
    alert("VGG");
    // get cookies from the request
    const cookies = req.headers.get('Cookie');
    console.log('Cookies:', cookies);

    // Pass on the cloned request instead of the original request
    return next.handle(authReq);
  }
}

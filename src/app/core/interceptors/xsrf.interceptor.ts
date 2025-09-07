// core/interceptors/xsrf.interceptor.ts
import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interceptor that reads the Django CSRF cookie (`csrftoken`)
 * and attaches it as an `X-CSRFToken` header to mutating requests.
 */
@Injectable({ providedIn: 'root' })
export class XsrfInterceptor implements HttpInterceptor {
	constructor(private xsrfExtractor: HttpXsrfTokenExtractor) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = this.xsrfExtractor.getToken();
		if (token && !req.headers.has('X-CSRFToken')) {
			req = req.clone({
				headers: req.headers.set('X-CSRFToken', token),
				withCredentials: true,
			});
		}
		return next.handle(req);
	}
}

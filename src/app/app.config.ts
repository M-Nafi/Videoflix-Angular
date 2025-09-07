import { ApplicationConfig, provideExperimentalZonelessChangeDetection, APP_INITIALIZER } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withXsrfConfiguration, withInterceptorsFromDi } from "@angular/common/http";
import { routes } from "./app.routes";
import { AuthService } from "./core/services/auth.service";

// Auth initialization function
export function initializeAuth(authService: AuthService) {
  return () => {
    return new Promise<void>((resolve) => {
      authService.authCheckComplete$.subscribe(complete => {
        if (complete) {
          resolve();
        }
      });
    });
  };
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideExperimentalZonelessChangeDetection(),
		provideRouter(routes),
		provideHttpClient(
			withXsrfConfiguration({
				cookieName: "csrftoken",
				headerName: "X-CSRFToken",
			}),
			withInterceptorsFromDi()
		),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeAuth,
			deps: [AuthService],
			multi: true
		}
	],
};
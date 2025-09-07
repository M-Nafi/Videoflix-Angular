import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService, LoginPayload } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-login',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputComponent,
		ButtonComponent,
		RouterLink,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	constructor(private auth: AuthService, private router: Router) {}

	loginForm = new FormGroup({
		email: new FormControl<string>('', {
			validators: [Validators.required, Validators.email],
			updateOn: 'change',
		}),
		password: new FormControl<string>('', {
			validators: [Validators.required, Validators.minLength(8)],
			updateOn: 'change',
		}),
	});

	serverError: string | null = null;

	/**
	 * Checks if a given control is invalid after user interaction.
	 * @param controlName Name of the FormControl in the FormGroup.
	 * @returns True if the control is invalid and has been touched.
	 */
	showError(controlName: string): boolean {
		const control = this.loginForm.get(controlName);
		return !!(control && control.invalid && control.touched);
	}

	/**
	 * Produces the appropriate error message for a specific control.
	 * @param controlName Name of the FormControl in the FormGroup.
	 * @returns A user-friendly validation message or null if no errors.
	 */
	errorMessage(controlName: string): string | null {
		const control = this.loginForm.get(controlName);
		if (!control || !control.errors) return null;
		const errs = control.errors;

		if (errs['email']) {
			return 'Invalid email';
		}
		if (errs['minlength']) {
			const len = errs['minlength'].requiredLength;
			return `Password must be at least ${len} characters long`;
		}
		return null;
	}

	/**
	 * Submits the login form after validating inputs and retrieving CSRF token.
	 *
	 * @remarks
	 * - Clears any existing server error message.
	 * - Fetches CSRF token via `getCsrfToken()`.
	 * - Performs login request with provided credentials.
	 * - On success, navigates to the main page.
	 * - On failure, captures and displays the server’s error message.
	 */
	onSubmit(): void {
		this.serverError = null;
		if (this.loginForm.valid) {
			const payload: LoginPayload = this.loginForm.value as LoginPayload;
			this.auth.login(payload).subscribe({
				next: () => this.router.navigate(['/mainpage']),
				error: (err) => {
					this.serverError =
						err.error?.non_field_errors?.[0] ||
						err.error?.detail ||
						'Login failed';
				},
			});
		}
	}
}

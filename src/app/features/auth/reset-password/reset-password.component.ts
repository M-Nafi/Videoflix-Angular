import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	Validators,
} from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { passwordMatchValidator } from '../../../shared/utils/custom.validator';
import { AuthService, ResetPayload } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-reset-password',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputComponent,
		ButtonComponent,
	],
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
	restPasswordForm = new FormGroup(
		{
			new_password: new FormControl<string>('', {
				validators: [Validators.required, Validators.minLength(8)],
				updateOn: 'blur',
			}),
			re_new_password: new FormControl<string>('', {
				validators: [Validators.required, Validators.minLength(8)],
				updateOn: 'blur',
			}),
		},
		{
			validators: passwordMatchValidator,
			updateOn: 'blur',
		}
	);

	serverError: string | null = null;

	constructor(private auth: AuthService, private router: Router) {}

	/**
	 * Indicates whether the two password fields do not match.
	 * @returns True if password2 has been touched, has a value, and does not match password1.
	 */
	get showPasswordMismatch(): boolean {
		const control = this.restPasswordForm.get('password2');
		return !!(
			control &&
			control.value &&
			control.touched &&
			this.restPasswordForm.hasError('passwordMismatch')
		);
	}

	/**
	 * Checks if a given control is invalid after user interaction.
	 * @param controlName Name of the FormControl in the FormGroup.
	 * @returns True if the control is invalid and has been touched.
	 */
	showError(controlName: string): boolean {
		const control = this.restPasswordForm.get(controlName);
		return !!(control && control.invalid && control.touched);
	}

	/**
	 * Produces the appropriate error message for a specific control.
	 * @param controlName Name of the FormControl in the FormGroup.
	 * @returns A user-friendly validation message or null if no errors.
	 */
	errorMessage(controlName: string): string | null {
		const control = this.restPasswordForm.get(controlName);
		if (!control || !control.errors) return null;
		const errs = control.errors;

		if (errs['minlength']) {
			const len = errs['minlength'].requiredLength;
			return `Password must be at least ${len} characters long`;
		}
		return null;
	}

	onSubmit(): void {
		this.serverError = null;
		if (this.restPasswordForm.valid) {
			const payload = this.restPasswordForm.value as ResetPayload;
			this.auth.forgotPassword(payload).subscribe({
				next: () =>
					this.router.navigate([
						'/auth/users/reset_password_confirm/',
					]),
				error: (err) => {
					this.serverError = err.error?.detail || 'Reset failed';
				},
			});
		}
	}
}

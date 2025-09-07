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
import { passwordMatchValidator } from '../../../shared/utils/custom.validator';
import {
    AuthService,
    RegisterPayload,
} from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent,
        ButtonComponent,
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
    registerForm = new FormGroup(
        {
            email: new FormControl<string>('', {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur',
            }),
            password: new FormControl<string>('', {
                validators: [Validators.required, Validators.minLength(8)],
                updateOn: 'change',
            }),
            confirmed_password: new FormControl<string>('', {
                validators: [Validators.required, Validators.minLength(8)],
                updateOn: 'change',
            }),
        },
        {
            validators: passwordMatchValidator,
            updateOn: 'change',
        }
    );

    serverError: string | null = null;

    /**
     * Constructor for RegisterComponent.
     * @param auth An instance of AuthService, needed for handling user registration.
     * @param router An instance of Router, needed for navigating to another page
     * after successful registration.
     * @param route An instance of ActivatedRoute, needed for getting email from query
     * parameter when routed from email-verification page.
     */
    constructor(
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    /**
     * Checks if the two password fields do not match.
     * @returns True if the confirmation password field has been touched,
     * has a value, and does not match the value of the password field.
     */
    get showPasswordMismatch(): boolean {
        const control = this.registerForm.get('confirmed_password');
        return !!(
            control &&
            control.value &&
            control.touched &&
            this.registerForm.hasError('passwordMismatch')
        );
    }

    /**
     * OnInit lifecycle hook. Subscribes to queryParams observable of ActivatedRoute.
     * If query parameter 'email' is present, it is used to set the value of the 'email'
     * form control in the register form.
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const emailFromQuery = params['email'];
            if (emailFromQuery) {
                this.registerForm.patchValue({ email: emailFromQuery });
            }
        });
    }

    /**
     * Checks if a given control is invalid after user interaction.
     * @param controlName Name of the FormControl in the FormGroup.
     * @returns True if the control is invalid and has been touched.
     */
    showError(controlName: string): boolean {
        const control = this.registerForm.get(controlName);
        return !!(control && control.invalid && control.touched);
    }

    /**
     * Produces the appropriate error message for a specific control.
     * @param controlName Name of the FormControl in the FormGroup.
     * @returns A user-friendly validation message or null if no errors.
     */
    errorMessage(controlName: string): string | null {
        const control = this.registerForm.get(controlName);
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
     * Submits the registration form after validating inputs.
     *
     * @remarks
     * - Clears any existing server error message.
     * - Performs registration request with provided credentials.
     * - On success, navigates to the email verification page.
     * - On failure, captures and displays the server's error message.
     */
    onSubmit(): void {
        this.serverError = null;
        if (this.registerForm.valid) {
            const formValue = this.registerForm.value!;
            const payload: RegisterPayload = {
                email: formValue.email ?? '',
                password: formValue.password ?? '',
                confirmed_password: formValue.confirmed_password ?? '',
            };
            this.auth.register(payload).subscribe({
                next: () => this.router.navigate(['/verify-email']),
                error: (err) => {
                    this.serverError =
                        err.error?.non_field_errors?.[0] ||
                        err.error?.detail ||
                        'Registration failed';
                },
            });
        }
    }
}

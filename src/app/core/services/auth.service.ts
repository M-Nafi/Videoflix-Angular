import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    Observable,
    tap,
    catchError,
    of,
    switchMap,
    take,
} from 'rxjs';

export interface RegisterPayload {
    email: string;
    password: string;
    confirmed_password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ResetPayload {
    email: string;
}

export interface PasswordResetConfirmPayload {
    uidb64: string;
    token: string;
    new_password: string;
    confirmed_password: string;
}

export interface SetPasswordPayload {
    current_password: string;
    new_password: string;
    confirmed_password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly baseUrl = 'https://157.180.86.208/api';
    private loggedInSubject = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.loggedInSubject.asObservable();

    private authCheckComplete = false;
    private authCheckCompleteSubject = new BehaviorSubject<boolean>(false);
    public authCheckComplete$ = this.authCheckCompleteSubject.asObservable();

    constructor(private http: HttpClient) {
        const wasLoggedIn = localStorage.getItem('wasLoggedIn') === 'true';
        if (wasLoggedIn) {
            this.validateExistingToken();
        } else {
            this.authCheckComplete = true;
            this.authCheckCompleteSubject.next(true);
        }
    }

    /**
     * If the user was logged in before (i.e. the user closed the browser or tab
     * without logging out), attempt to validate the existing token. If the token
     * is valid, set the user as logged in; otherwise, set the user as not logged
     * in. In either case, also set the auth check as complete.
     */
    private validateExistingToken(): void {
        this.refreshToken().subscribe({
            next: () => {
                this.loggedInSubject.next(true);
                this.authCheckComplete = true;
                this.authCheckCompleteSubject.next(true);
            },
            error: (err) => {
                this.loggedInSubject.next(false);
                this.authCheckComplete = true;
                this.authCheckCompleteSubject.next(true);
            },
        });
    }

    /**
     * Returns an observable that emits the current login status of the user.
     *
     * If the auth check has already been completed (i.e. the user has previously
     * interacted with the site), this observable emits the current value of
     * `isLoggedIn$` immediately. Otherwise, it waits for the auth check to
     * complete, then emits the value of `isLoggedIn$`.
     */
    public checkAuthStatus(): Observable<boolean> {
        if (this.authCheckComplete) {
            return of(this.loggedInSubject.value);
        }

        return this.authCheckComplete$.pipe(
            take(1),
            tap(() => (this.authCheckComplete = true)),
            switchMap(() => of(this.loggedInSubject.value))
        );
    }

    /**
     * Submits a registration form with the given payload to the server.
     *
     * @param payload The registration payload.
     * @returns An observable that emits the server's response.
     */
    register(payload: RegisterPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/register/`, payload, {
            withCredentials: true,
        });
    }

    /**
     * Submits a login form with the given payload to the server.
     *
     * @param payload The login payload.
     * @returns An observable that emits the server's response.
     *          If the login succeeds, sets the user as logged in.
     */
    login(payload: LoginPayload): Observable<any> {
        return this.http
            .post(`${this.baseUrl}/login/`, payload, {
                withCredentials: true,
            })
            .pipe(
                tap(() => {
                    localStorage.setItem('wasLoggedIn', 'true');
                    this.loggedInSubject.next(true);
                })
            );
    }

    /**
     * Requests a new access token from the server and updates the
     * subject when the request succeeds.
     *
     * @returns An observable that emits the server's response and
     *          sets the user as logged in if the request succeeds.
     */
    refreshToken(): Observable<any> {
        return this.http
            .post(
                `${this.baseUrl}/token/refresh/`,
                {},
                {
                    withCredentials: true,
                }
            )
            .pipe(
                tap(() => this.loggedInSubject.next(true)),
                catchError((err) => {
                    this.loggedInSubject.next(false);
                    // prevents hard error
                    return of(null); 
                })
            );
    }

    /**
     * Logs out the user.
     *
     * @returns An observable that emits the server's response and
     *          sets the user as logged out if the request succeeds.
     *          If the server is unreachable, logs out the user anyway.
     */
    logout(): Observable<any> {
        return this.http
            .post(
                `${this.baseUrl}/logout/`,
                {},
                {
                    withCredentials: true,
                }
            )
            .pipe(
                tap(() => {
                    localStorage.removeItem('wasLoggedIn');
                    this.loggedInSubject.next(false);
                }),
                catchError((err) => {
                    // log out anyway, even if server is not available
                    localStorage.removeItem('wasLoggedIn');
                    this.loggedInSubject.next(false);
                    // ingores hard error
                    return of(null); 
                })
            );
    }

    /**
     * Submits a password reset form with the given payload to the server.
     *
     * @param payload The password reset payload.
     * @returns An observable that emits the server's response.
     */
    forgotPassword(payload: ResetPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/password_reset/`, payload, {
            withCredentials: true,
        });
    }

    /**
     * Submits a password reset confirmation form with the given payload to the server.
     *
     * @param payload The password reset confirmation payload.
     * @returns An observable that emits the server's response.
     */
    confirmPasswordReset(
        payload: PasswordResetConfirmPayload
    ): Observable<any> {
        const url = `${this.baseUrl}/password_confirm/${payload.uidb64}/${payload.token}/`;
        const body = {
            new_password: payload.new_password,
            confirmed_password: payload.confirmed_password,
        };
        return this.http.post(url, body, { withCredentials: true });
    }

    /**
     * Submits a set password form with the given payload to the server.
     *
     * @param payload The set password payload.
     * @returns An observable that emits the server's response.
     */
    setPassword(payload: SetPasswordPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/set_password/`, payload, {
            withCredentials: true,
        });
    }
}

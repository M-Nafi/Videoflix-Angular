import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.auth.authCheckComplete$.pipe(
            take(1),
            switchMap(() => this.auth.isLoggedIn$.pipe(take(1))),
            map((loggedIn) =>
                loggedIn ? true : this.router.createUrlTree(['/login'])
            )
        );
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-footer',
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    currentRoute = '';

    allowedFooterRoutes = [
        '/',
        '/login',
        '/register',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
        '/mainpage',
        '/privacy-policy',
        '/imprint',
    ];

    /**
     * Indicates whether the footer should be visible for the current route.
     *
     * @returns True if the footer should be visible, false otherwise.
     */
    showFooter(): boolean {
        return this.allowedFooterRoutes.includes(this.currentRoute);
    }

    /**
     * Sets up the footer component to listen to route changes.
     *
     * When the route changes, the `currentRoute` property is updated to the new route.
     * @param router The router to listen to.
     */
    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentRoute = event.urlAfterRedirects.split('?')[0];
            });
    }
}

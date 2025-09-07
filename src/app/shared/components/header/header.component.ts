import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { effect } from '@angular/core';
import { VideoService } from '../../../services/video.service';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterLink, ButtonComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    currentRoute = '';
    videoTitle = '';

    /**
     * The constructor of the header component. It is used to initialize the component.
     * It subscribes to the router events to detect the current route and sets the title of the current video.
     * If the current route is not the video player route, it resets the title of the current video.
     * @param authService The auth service to log out the user.
     * @param router The router to navigate to the login page.
     * @param videoService The video service to get the title of the current video.
     */
    constructor(private authService: AuthService, private router: Router, private videoService: VideoService) {
        this.router.events.subscribe(() => {
            this.currentRoute = this.router.url.split('?')[0];
            if (this.currentRoute !== '/video-player') {
                this.videoService.title.set('');
            }
        });
        effect(() => {
            const title = this.videoService.title();
            setTimeout(() => {
                this.videoTitle = title;
            });
        });
    }

    /**
     * Goes back to the previous page in the browser history.
     */
    goBack() {
        window.history.back();
    }

    /**
     * Logs out the user by calling the logout service and then navigates to the login page.
     */
    onLogout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}

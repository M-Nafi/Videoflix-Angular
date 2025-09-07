import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'Videoflix';

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.scrollToTop();
            });
    }

    scrollToTop(): void {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }
}

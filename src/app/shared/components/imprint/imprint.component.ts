import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-imprint',
    imports: [RouterModule],
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
})
export class ImprintComponent {
    constructor(private location: Location) {}

    /**
     * Navigates the user back to the previous page in the browser's history.
     */
    goBack() {
        this.location.back();
    }
}
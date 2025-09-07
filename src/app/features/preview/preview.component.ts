import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-preview',
    imports: [CommonModule, RouterModule],
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.scss',
})
export class PreviewComponent {
    activeImage!: string;

    constructor(private route: ActivatedRoute, private location: Location) {}


    /**
     * Initializes the component and sets the active image based on the query
     * parameters in the route.
     */
    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.activeImage = params['img'];
        });
    }
    /**
     * Navigates the user back to the previous page in the browser's history.
     */
    goBack() {
        this.location.back();
    }
}

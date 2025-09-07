import { Component, input } from "@angular/core";
import { RouterModule } from '@angular/router';
import { ButtonComponent } from "../../shared/components/button/button.component"; 
import { FormsModule } from '@angular/forms';

@Component({
	selector: "app-landingpage",
	imports: [RouterModule, ButtonComponent, FormsModule],
	templateUrl: "./landingpage.component.html",
	styleUrl: "./landingpage.component.scss",
})
export class LandingpageComponent {
	email = "";

}

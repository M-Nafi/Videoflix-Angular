import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
/**
 * @remarks
 * Zeigt dem Nutzer nach der Registrierung eine Nachricht an,
 * dass er seine E-Mail verifizieren muss.
 */

@Component({
	selector: 'app-verify-email',
	imports: [CommonModule, RouterModule],
	templateUrl: './verify-email.component.html',
	styleUrl: './verify-email.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent {}

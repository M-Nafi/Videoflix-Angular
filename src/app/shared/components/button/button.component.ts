import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ClassMap = Record<string, boolean>;

/**
 * A reusable button component.
 * @remarks
 * - Standardised styling for buttons.
 * - Supports disabled state and content projection.
 */
@Component({
	selector: 'app-button',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
	/** Button type attribute */
	@Input() type: 'button' | 'submit' = 'button';
	/** Disabled state */
	@Input() disabled: boolean = false;

	@Input() customClass?: string;

	disabledStyle = (): ClassMap | null => {
		if (this.customClass === 'disable-btn' && this.disabled) {
			return { 'disable-btn': this.disabled };
		}
		return null;
	};
}

import { Component, Input, ChangeDetectionStrategy, Injector, OnInit, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";

/**
 * A reusable input component implementing ControlValueAccessor.
 * @remarks
 * - Integrates with Reactive Forms via NgControl fetched lazily.
 */
@Component({
	selector: "app-input",
	standalone: true,
	imports: [CommonModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true,
		},
	],
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor, OnInit {
	@Input() type: string = "text";
	@Input() placeholder: string = "";
	@Input() isVisible: boolean = false;
	@Input() srcRight: string = "/assets/icons/visibility.svg";

	visibleIcon: string = "/assets/icons/visibility.svg";
	visibleIconOff: string = "/assets/icons/visibility_off.svg";
	emailIcon: string = "/assets/icons/mail-icon.svg";
	pwIcon: string = "/assets/icons/password.svg";
	value: string = "";

	/** Underlying NgControl, fetched lazily to avoid DI cycle */
	private ngControl?: NgControl;

	/** Function called when the value changes */
	onChange: (value: any) => void = () => {};
	/** Function called when the input is touched */
	onTouched: () => void = () => {};

	/**
	 * @param injector Angular injector used to lazily retrieve NgControl.
	 */
	constructor(private injector: Injector) {}

	/**
	 * Lifecycle hook: registers this component as the ControlValueAccessor
	 * and saves the NgControl reference to read validation state.
	 */
	ngOnInit(): void {
		const control = this.injector.get(NgControl, null);
		if (control) {
			control.valueAccessor = this;
			this.ngControl = control;
		}
	}

	/**
	 * Writes a value from the form model into the view.
	 * @param obj The new value from the FormControl
	 */
	writeValue(obj: any): void {
		this.value = obj ?? "";
	}

	/**
	 * Registers a callback to notify the form when the value changes.
	 * @param fn Callback to call on change
	 */
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	/**
	 * Registers a callback to notify the form when the control is touched.
	 * @param fn Callback to call on touch
	 */
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	/**
	 * Optional method to handle disabled state changes.
	 * @param isDisabled True if the control should be disabled
	 */
	setDisabledState?(isDisabled: boolean): void {}

	/**
	 * Invoked on every user input event.
	 * @param value The new input value
	 */
	onInput(value: string): void {
		this.value = value;
		this.onChange(value);
	}

	/**
	 * Toggles the password visibility and updates the icon accordingly.
	 *
	 * This method switches the input’s `type` between `"password"` and `"text"`,
	 * and swaps the `src` property between the visible and hidden icon assets.
	 */
	toggleVisibilityPw(): void {
		this.srcRight = this.type === "password" ? this.visibleIconOff : this.visibleIcon;
		this.type = this.type === "password" ? "text" : "password";
	}

	/**
	 * Computes dynamic padding-top based on the current input type.
	 */
	fixPosImg(): object {
		return { "padding-top": this.type === "password" ? "0rem" : "0.3rem" };
	}

	/**
	 * Selects the appropriate placeholder icon based on the current input type.
	 */
	togglePlaceholderIcon(): string {
		return this.type === "email" ? this.emailIcon : this.pwIcon;
	}
}

import { isUndefined } from 'ionic-angular/util/util';
import { Event } from './event';

export class DoorbellEvent extends Event {

	private _buttonId: string;

	public static factory (values: any) {
		const safeValues = Object.assign(values);

		safeValues.dateTime = !isUndefined(safeValues.dateTime) ? new Date(safeValues.dateTime) : new Date();
		safeValues.buttonId = !isUndefined(safeValues.buttonId) ? safeValues.buttonId : '';

		return new DoorbellEvent(
			safeValues.dateTime,
			safeValues.buttonId
		);
	}

	constructor (
		dateTime: Date,
		buttonId: string
	) {
		super(dateTime);
		this._buttonId = buttonId;
	}

	get buttonId (): string {
		return this._buttonId;
	}

	set buttonId (value: string) {
		this._buttonId = value;
	}
}

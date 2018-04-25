import { isUndefined } from 'ionic-angular/util/util';
import { Event } from './event';
import { BELL_IDENTIFIER } from '../enums/bellIds.enum';

export class DoorbellEvent extends Event {

	private _buttonId: BELL_IDENTIFIER;

	public static factory (values: any) {
		const safeValues = Object.assign(values);

		safeValues.dateTime = !isUndefined(safeValues.dateTime) ? new Date(safeValues.dateTime) : new Date();
		safeValues.buttonId = !isUndefined(safeValues.buttonId) ? safeValues.buttonId : BELL_IDENTIFIER.BOTTOM;

		return new DoorbellEvent(
			safeValues.dateTime,
			safeValues.buttonId
		);
	}

	constructor (
		dateTime: Date,
		buttonId: BELL_IDENTIFIER
	) {
		super(dateTime);
		this._buttonId = buttonId;
	}

	get buttonId (): BELL_IDENTIFIER {
		return this._buttonId;
	}

	set buttonId (value: BELL_IDENTIFIER) {
		this._buttonId = value;
	}
}

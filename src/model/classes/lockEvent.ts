import { isUndefined } from 'ionic-angular/util/util';
import { Event } from './event';

export class DoorlockEvent extends Event {

	private _userName: string;

	public static factory (values: any) {
		const safeValues = Object.assign(values);

		safeValues.dateTime = !isUndefined(safeValues.dateTime) ? new Date(safeValues.dateTime) : new Date();
		safeValues.userName = !isUndefined(safeValues.userName) ? safeValues.userName : '';

		return new DoorlockEvent(
			safeValues.dateTime,
			safeValues.userName
		);
	}

	constructor (
		dateTime: Date,
		userName: string
	) {
		super(dateTime);
		this._userName = userName;
	}

	get userName (): string {
		return this._userName;
	}

	set userName (value: string) {
		this._userName = value;
	}
}

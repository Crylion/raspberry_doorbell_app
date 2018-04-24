import { isUndefined } from 'ionic-angular/util/util';

export class Event {

	private _dateTime: Date;

	public static factory (values: any) {
		const safeValues = Object.assign(values);

		safeValues.dateTime = !isUndefined(safeValues.dateTime) ? new Date(safeValues.dateTime) : new Date();

		return new Event(
			safeValues.dateTime
		);
	}

	constructor (
		dateTime: Date
	) {
		this._dateTime = dateTime;
	}

	get dateTime (): Date {
		return this._dateTime;
	}

	set dateTime (value: Date) {
		this._dateTime = new Date(value);
	}
}

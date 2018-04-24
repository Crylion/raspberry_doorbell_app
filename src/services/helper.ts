import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class Helper {

	/**
	 * Returns formatted dateTime string for a given Date object in the optional
	 * string format, or in a default format
	 * @param dateTime The date to be formatted
	 * @param format A date format string, e.g. 'DD.MM.YYYY HH:mm'
	 * @returns {string}
	 */
	public formatDateTime (dateTime: Date | moment.Moment, format: string = 'DD. MMM, LT') {
		return moment(dateTime).format(format);
	}

	/**
	 * returns a boolean representing whether the given date is on the same day
	 * as a newly created Date object to check if the date is today
	 * @param date
	 * @returns {boolean} If Date is today
	 */
	public isDateToday (date: Date): boolean {
		return moment(date).isSame(new Date(), 'day');
	}
}

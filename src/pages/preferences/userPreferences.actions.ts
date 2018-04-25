import { Action } from '@ngrx/store';
import { BELL_IDENTIFIER } from '../../model/enums/bellIds.enum';

export const UPDATE_USERNAME = '[User] Update chosen Username';
/**
 * This action sets the username of the user
 */
export class UpdateUsername implements Action {
	public readonly type = UPDATE_USERNAME;

	constructor (public payload: string) {
		// Payload the string of the username
	}
}

export const UPDATE_BELL_PREFERENCES = '[User] Update user prefs for bell notifications';
/**
 * This action sets the preferences which dictate, which bell notifications
 * the user gets
 */
export class UpdateBellPrefs implements Action {
	public readonly type = UPDATE_BELL_PREFERENCES;

	constructor (public payload: BELL_IDENTIFIER[]) {
		// Payload is an array of bell identifiern
	}
}

export type Action =
UpdateUsername | UpdateBellPrefs;

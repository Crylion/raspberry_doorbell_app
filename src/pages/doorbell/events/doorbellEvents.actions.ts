import { Action } from '@ngrx/store';

export const CLEAR_DOORBELL_EVENTS = '[Doorbell Events] Clear list';
/**
 * This action clears the list of doorbell events.
 */
export class ClearEvents implements Action {
	public readonly type = CLEAR_DOORBELL_EVENTS;
}

export const ADD_DOORBELL_EVENT = '[Doorbell Events] Add event to list';
/**
 * This action clears the list of doorbell events.
 */
export class AddEvent implements Action {
	public readonly type = ADD_DOORBELL_EVENT;

	constructor (public payload: Date) {
		// Payload is a date object of the time and date of the doorell event
	}
}

export type Action =
	ClearEvents | AddEvent;

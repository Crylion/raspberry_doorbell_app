import { Action } from '@ngrx/store';
import { Event } from '../../model/classes/event';

export const CLEAR_DOOR_EVENTS = '[Door Events] Clear list';
/**
 * This action clears the list of doorbell events.
 */
export class ClearEvents implements Action {
	public readonly type = CLEAR_DOOR_EVENTS;
}

export const ADD_DOOR_EVENT = '[Door Events] Add event to list';
/**
 * This action adds and event to the list of doorbell events.
 */
export class AddEvent implements Action {
	public readonly type = ADD_DOOR_EVENT;

	constructor (public payload: Event) {
		// Payload is a Event object of the time and date of the doorbell event and the button
		// that triggered it, or the date and time of the door lock being triggered and the username
		// of the user that triggered it
	}
}

export const SET_DOOR_EVENT_LIST = '[Door Events] Set list of events with new list';
/**
 * This action sets the list of doorbell events.
 */
export class SetEventList implements Action {
	public readonly type = SET_DOOR_EVENT_LIST;

	constructor (public payload: Event[]) {
		// Payload is an array of Events
	}
}

export type Action =
	ClearEvents | AddEvent | SetEventList;

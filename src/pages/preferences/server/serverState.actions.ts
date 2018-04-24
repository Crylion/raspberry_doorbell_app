import { Action } from '@ngrx/store';

export const UPDATE_SERVER_URL = '[Server] Update Url of Server';
/**
 * This action sets the url of the server for the api service
 */
export class UpdateUrl implements Action {
	public readonly type = UPDATE_SERVER_URL;

	constructor (public payload: string) {
		// Payload the string of the url of the server
	}
}

export const UPDATE_SERVER_AVAILABILITY = '[Server] Update Online status of the server';
/**
 * This action clears the list of doorbell events.
 */
export class UpdateStatus implements Action {
	public readonly type = UPDATE_SERVER_AVAILABILITY;

	constructor (public payload: boolean) {
		// Payload is a booleon stating whether the server is available
	}
}

export const UPDATE_SERVER_VERSION = '[Server] Update verison number of the server';
/**
 * This action clears the list of doorbell events.
 */
export class UpdateVersion implements Action {
	public readonly type = UPDATE_SERVER_VERSION;

	constructor (public payload: string) {
		// Payload is the version string of the server
	}
}

export type Action =
UpdateUrl | UpdateStatus | UpdateVersion;

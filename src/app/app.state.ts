import { Event } from '../model/classes/event';

export interface AppState {
	doorEvents: Event[];
	serverState: {
		url: string,
		version: string,
		online: boolean
	};
}

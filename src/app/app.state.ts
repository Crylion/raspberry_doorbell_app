import { Event } from '../model/classes/event';
import { BELL_IDENTIFIER } from '../model/enums/bellIds.enum';

export interface AppState {
	doorEvents: Event[];
	serverState: {
		url: string,
		version: string,
		online: boolean
	};
	userPreferences: {
		username: string,
		bellPreference: BELL_IDENTIFIER[]
	};
}

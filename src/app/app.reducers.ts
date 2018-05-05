import { ActionReducerMap, Action } from '@ngrx/store';
import { AppState } from './app.state';
import { doorEventsReducer } from '../pages/events/doorEvents.reducer';
import { serverStateReducer } from '../pages/preferences/server/serverState.reducer';
import { userPreferencesReducer } from '../pages/preferences/userPreferences.reducer';

export const reducers: ActionReducerMap<AppState, Action> = {
	doorEvents: doorEventsReducer,
	serverState: serverStateReducer,
	userPreferences: userPreferencesReducer
};

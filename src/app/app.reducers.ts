import { ActionReducerMap, Action } from '@ngrx/store';
import { AppState } from './app.state';
import { doorEventsReducer } from '../pages/doorbell/events/doorEvents.reducer';
import { serverStateReducer } from '../pages/preferences/server/serverState.reducer';

export const reducers: ActionReducerMap<AppState, Action> = {
	doorEvents: doorEventsReducer,
	serverState: serverStateReducer
};

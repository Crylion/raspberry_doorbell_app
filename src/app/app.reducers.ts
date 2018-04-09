import { ActionReducerMap, Action } from '@ngrx/store';
import { AppState } from './app.state';
import { doorbellEventsReducer } from '../pages/doorbell/events/doorbellEvents.reducer';

export const reducers: ActionReducerMap<AppState, Action> = {
	doorbellEvents: doorbellEventsReducer
};

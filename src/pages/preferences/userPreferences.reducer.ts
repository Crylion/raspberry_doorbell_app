import * as UserPreferences from './userPreferences.actions';
import { BELL_IDENTIFIER } from '../../model/enums/bellIds.enum';

export const defaultState = {
	username: 'App',
	bellPreference: [
		BELL_IDENTIFIER.TOP,
		BELL_IDENTIFIER.BOTTOM
	]
};

export function userPreferencesReducer (state = defaultState, action: UserPreferences.Action) {
	switch (action.type) {
		case UserPreferences.UPDATE_USERNAME:
			return Object.assign({}, state, {
				username: action.payload
			});
		case UserPreferences.UPDATE_BELL_PREFERENCES:
			return Object.assign({}, state, {
				bellPreference: action.payload
			});
		default:
			return state;
	}
}

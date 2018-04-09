import * as DoorbellEvents from './doorbellEvents.actions';

export const defaultState = [];

export function doorbellEventsReducer (state = defaultState, action: DoorbellEvents.Action) {
	switch (action.type) {
		case DoorbellEvents.CLEAR_DOORBELL_EVENTS:
			return defaultState;
		case DoorbellEvents.ADD_DOORBELL_EVENT:
			// clone current list of doorbell events
			const newList: any[] = [].concat(state);
			// add the new event
			newList.unshift(action.payload);
			// return updated list
			return newList;
		default:
			return state;
	}
}

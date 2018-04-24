import * as DoorEvents from './doorEvents.actions';

export const defaultState = [];

export function doorEventsReducer (state = defaultState, action: DoorEvents.Action) {
	switch (action.type) {
		case DoorEvents.CLEAR_DOOR_EVENTS:
			return defaultState;
		case DoorEvents.ADD_DOOR_EVENT:
			// clone current list of doorbell events
			const newList: any[] = [].concat(state);
			// add the new event
			newList.unshift(action.payload);
			// return updated list
			return newList;
		case DoorEvents.SET_DOOR_EVENT_LIST:
			return action.payload;
		default:
			return state;
	}
}

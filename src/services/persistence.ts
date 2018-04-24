import { isNullOrUndefined } from 'util';
import { DoorbellEvent } from '../model/classes/doorbellEvent';
import { DoorlockEvent } from '../model/classes/lockEvent';
import { Event } from '../model/classes/event';

const stateKeys = [
	'doorEvents',
	'serverState'
];
let currentState: any;

export const sanitizeObjectPropertyNames = (obj: any): any => {
	for (const property in obj) {
		if (obj.hasOwnProperty(property) && !isNullOrUndefined(obj[property])) {

			if (typeof obj[property] === 'object') {
				if (obj[property].length > 0) {
					for (let i of obj[property]) {
						i = sanitizeObjectPropertyNames(i);
					}
				} else {
					obj[property] = sanitizeObjectPropertyNames(obj[property]);
				}
			}

			if (property.substr(0, 1) === '_') {
				obj[property.substr(1)] = obj[property];
				delete obj[property];
			}

		}
	}
	return obj;
};

const extractDoorbellEvents = (storage: Storage, state: {}, key): {} => {
	const storedDoorEvents: any = sanitizeObjectPropertyNames(JSON.parse(storage.getItem(key)));
	if (!isNullOrUndefined(storedDoorEvents)) {
		const normalizedList: Event[] = [];

		for (const item of storedDoorEvents) {
			if ('buttonId' in item) {
				normalizedList.push(DoorbellEvent.factory({
					buttonId: item.id,
					dateTime: item.dateTime
				}));
			} else if ('userName' in item) {
				normalizedList.push(DoorlockEvent.factory({
					userName: item.user,
					dateTime: item.dateTime
				}));
			}
		}

		state[key] = normalizedList;
	} else {
		state[key] = undefined;
	}
	return state;
};

/**
 * Gets values for all keys of data in the state and individually
 * deserializes them however appropriate for the given type of data
 * @param storage reference to the selected storage interface (default localstorage)
 * @returns {} rehydrated application state structure
 */
export const rehydrateApplicationState = (storage: Storage) => {
	let state: {} = {};
	for (const key of stateKeys) {
		switch (key) {
			case 'doorEvents':
				state = extractDoorbellEvents(storage, state, key);
				break;
			default:
				const stateValue = storage.getItem(key);
				if (!isNullOrUndefined(stateValue)) {
					state[key] = JSON.parse(stateValue);
				} else {
					state[key] = undefined;
				}
				break;
		}
	}
	return state;
};

/**
 * Iterates over keys of data in state and individually serializes them if necessary
 * @param state new state of the app after the latest run of reducers
 * @param storage reference to the selected storage interface (default localstorage)
 */
export const syncStateUpdate = (state: any, storage: Storage) => {
	for (const key of stateKeys) {
		switch (key) {
			default:
				storage.setItem(key, JSON.stringify(state[key]));
				break;

		}
	}
};

/**
 * The init method of this 'middleware'
 * @param storage Reference to the selected storage, defaults to localstorage
 * @returns function for ngrx to call whenever an action gets dispatched
 */
export function storeSync (storage: Storage = localStorage) {

	return (reducer: any) => {
		const rehydratedState = rehydrateApplicationState(storage);

		return (state = rehydratedState, action: any) => {
			/*
			 Handle case where state is rehydrated AND initial state is supplied.
			 Any additional state supplied will override rehydrated state for the given key.
			 */
			if (action.type === '@ngrx/store/init' && rehydratedState) {
				state = Object.assign({}, state, rehydratedState);
			}
			const nextState = reducer(state, action);
			currentState = Object.assign({}, nextState);
			syncStateUpdate(nextState, storage);
			return nextState;
		};
	};
}

export const getStateJSON = () => {
	return currentState;
};

import * as ServerState from './serverState.actions';

export const defaultState = {
	url: 'http://192.168.178.45:2342',
	version: '0',
	online: false
};

export function serverStateReducer (state = defaultState, action: ServerState.Action) {
	switch (action.type) {
		case ServerState.UPDATE_SERVER_URL:
			return Object.assign({}, state, {
				url: action.payload
			});
		case ServerState.UPDATE_SERVER_AVAILABILITY:
			return Object.assign({}, state, {
				online: action.payload
			});
		case ServerState.UPDATE_SERVER_VERSION:
			return Object.assign({}, state, {
				version: action.payload
			});
		default:
			return state;
	}
}

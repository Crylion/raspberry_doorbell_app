import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isUndefined } from 'ionic-angular/util/util';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../../app/app.state';
import { Helper } from '../../../services/helper';
import * as ServerState from '../../preferences/server/serverState.actions';
import * as DoorEvents from './doorEvents.actions';
import { ApiService } from '../../../services/apiService';

@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage implements OnInit, OnDestroy {

	public doorEvents: any;
	private doorEventsSubscription: Subscription;

	constructor (public helper: Helper,
		private store: Store<AppState>,
		private apiService: ApiService) {

	}

	public ngOnInit () {
		this.doorEventsSubscription = this.store.select((s: AppState) => s.doorEvents).subscribe((events) => {
			if (!isUndefined(events)) {
				this.doorEvents = events.slice().reverse();
			}
		});

		// Fetch door events for the first time to populate lists in home and events pages
		this.apiService.fetchAllEvents().subscribe((events) => {
			this.store.dispatch(new DoorEvents.SetEventList(events));
			this.store.dispatch(new ServerState.UpdateStatus(true));
		}, (error) => {
			this.store.dispatch(new ServerState.UpdateStatus(false));
		});
	}

	public ngOnDestroy () {
		this.doorEventsSubscription.unsubscribe();
	}

	/**
	 * Click handler for "clear list" button.
	 * Dispatches Action to clear the list of Doorbell Events
	 */
	public clearList () {
		this.apiService.deleteAllEvents().subscribe(() => {
			// next block
		}, () => {
			// error block
		}, () => {
			this.store.dispatch(new DoorEvents.ClearEvents());
		});
	}

	public getTypeName (event: Event): string {
		switch (event.constructor.name) {
			case 'DoorbellEvent':
				return 'bell';
			case 'DoorlockEvent':
				return 'lock';
			default:
				return 'bell';
		}
	}

}

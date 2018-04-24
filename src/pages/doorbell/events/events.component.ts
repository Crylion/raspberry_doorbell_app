import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isUndefined } from 'ionic-angular/util/util';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../../app/app.state';
import { Helper } from '../../../services/helper';
import * as DoorEvents from './doorEvents.actions';

@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage implements OnInit, OnDestroy {

	public doorEvents: any;
	private doorEventsSubscription: Subscription;

	constructor (public helper: Helper,
		private store: Store<AppState>) {

	}

	public ngOnInit () {
		this.doorEventsSubscription = this.store.select((s: AppState) => s.doorEvents).subscribe((events) => {
			if (!isUndefined(events)) {
				this.doorEvents = events.slice().reverse();
			}
		});
	}

	public ngOnDestroy () {
		this.doorEventsSubscription.unsubscribe();
	}

	// TODO
	/**
	 * Click handler for "clear list" button.
	 * Dispatches Action to clear the list of Doorbell Events
	 */
	public clearList () {
		this.store.dispatch(new DoorEvents.ClearEvents());
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

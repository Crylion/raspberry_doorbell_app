import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/app.state';
import * as DoorbellEvents from './doorbellEvents.actions';
import { Subscription } from 'rxjs/Subscription';
import { isUndefined } from 'ionic-angular/util/util';
import { Helper } from '../../../services/helper';

@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage implements OnInit, OnDestroy {

	public doorbellEvents: any;
	private doorbellEventsSubscription: Subscription;

	constructor (public helper: Helper,
		private store: Store<AppState>) {

	}

	public ngOnInit () {
		this.doorbellEventsSubscription = this.store.select((s: AppState) => s.doorbellEvents).subscribe((events) => {
			if (!isUndefined(events)) {
				this.doorbellEvents = events;
			}
		});
	}

	public ngOnDestroy () {
		this.doorbellEventsSubscription.unsubscribe();
	}

	/**
	 * Click handler for "clear list" button.
	 * Dispatches Action to clear the list of Doorbell Events
	 */
	public clearList () {
		this.store.dispatch(new DoorbellEvents.ClearEvents());
	}

	public addEvent () {
		this.store.dispatch(new DoorbellEvents.AddEvent(new Date()));
	}

}

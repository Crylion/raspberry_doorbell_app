import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { AppState } from '../../app/app.state';
import { Event } from '../../model/classes/event';
import { ApiService } from '../../services/apiService';
import { Helper } from '../../services/helper';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

	public recentEvents: Event[];
	public doorEventsSubscription: Subscription;
	public serverState: any;

	private stateSubscription: Subscription;

	constructor (
		public navCtrl: NavController,
		public helper: Helper,
		private apiService: ApiService,
		private store: Store<AppState>) {

	}

	public ngOnInit () {
		this.doorEventsSubscription = this.store.select((s: AppState) => s.doorEvents).subscribe((events) => {
			if (events.length > 5) {
				this.recentEvents = events.splice(events.length - 5, 5);
			} else {
				this.recentEvents = events;
			}
		});

		this.stateSubscription = this.store.select((s: AppState) => s.serverState).subscribe((state) => {
			this.serverState = state;
		});
	}

	public ngOnDestroy () {
		this.doorEventsSubscription.unsubscribe();
		this.stateSubscription.unsubscribe();
	}

	/**
	 * Click handler for 'open lock' button.
	 * Sends request to api to trigger the door lock
	 */
	public sendOpenCommand () {
		this.apiService.openDoor().subscribe((result) => {
			console.log(result);
		}, (err) => {
			console.log(err);
		});
	}

	// TODO
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

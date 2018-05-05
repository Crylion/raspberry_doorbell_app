import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

import { AppState } from '../../app/app.state';
import { Event } from '../../model/classes/event';
import { ApiService } from '../../services/apiService';
import { Helper } from '../../services/helper';
import { DoorbellEvent } from '../../model/classes/doorbellEvent';
import { DoorlockEvent } from '../../model/classes/lockEvent';
import { GarageDoorEvent } from '../../model/classes/garageDoorEvent';

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
				this.recentEvents = events.slice(events.length - 5, events.length).reverse();
			} else {
				this.recentEvents = events.reverse();
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
	public sendOpenDoorCommand () {
		this.apiService.openDoor().subscribe((result) => {
			console.log(result);
		}, (err) => {
			console.log(err);
		});
	}

	/**
	 * Click handler for 'open garage' button.
	 * Sends request to api to trigger the garage door
	 */
	public sendOpenGarageCommand () {
		this.apiService.openGarageDoor().subscribe((result) => {
			console.log(result);
		}, (err) => {
			console.log(err);
		});
	}

	// TODO
	public getTypeName (event: Event): string {
		if (event instanceof DoorbellEvent) {
			return 'bell';
		} else if (event instanceof DoorlockEvent) {
			return 'lock';
		} else if (event instanceof GarageDoorEvent) {
			return 'garage';
		} else {
			return 'bell';
		}
	}

}

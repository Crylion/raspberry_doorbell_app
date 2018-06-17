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
import * as ServerState from '../preferences/server/serverState.actions';
import * as DoorEvents from '../events/doorEvents.actions';
import { ServerPreferencesPage } from '../preferences/server/server';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

	public recentEvents: Event[];
	public doorEventsSubscription: Subscription;
	public serverState: any;
	public busyCheckingState: boolean;

	private stateSubscription: Subscription;

	constructor (
		public navCtrl: NavController,
		public helper: Helper,
		private apiService: ApiService,
		private store: Store<AppState>) {

			// TODO use state for spinner
			this.busyCheckingState = false;

	}

	public ngOnInit () {
		this.doorEventsSubscription = this.store.select((s: AppState) => s.doorEvents).subscribe((events: Event[]) => {
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

	/**
	 * Click handler for the info banner up top.
	 * Pushes the server settings page to the nav stack
	 */
	public goToServerSettings () {
		this.navCtrl.push(ServerPreferencesPage);
	}

	/**
	 * Click handler for refresh icon in server info.
	 * Pings the server to refresh events and online status
	 */
	public refreshStatus (event: any) {
		event.stopPropagation();
		this.busyCheckingState = true;

		// Ping server with current Ip address to determine whether it is online
		this.apiService.pingIpForServer(this.serverState.url).subscribe((result) => {
			this.store.dispatch(new ServerState.UpdateStatus(true));
			this.store.dispatch(new ServerState.UpdateVersion(result.version));

			this.apiService.fetchAllEvents().subscribe((events) => {
				this.store.dispatch(new DoorEvents.SetEventList(events));
			});
			this.busyCheckingState = false;
		}, (error) => {
			this.store.dispatch(new ServerState.UpdateStatus(false));
			this.busyCheckingState = false;
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

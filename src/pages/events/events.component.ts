import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isUndefined } from 'ionic-angular/util/util';
import { Subscription } from 'rxjs/Subscription';
import { AlertController } from 'ionic-angular';

import { AppState } from '../../app/app.state';
import { Helper } from '../../services/helper';
import * as ServerState from '../preferences/server/serverState.actions';
import * as DoorEvents from './doorEvents.actions';
import { ApiService } from '../../services/apiService';
import { DoorbellEvent } from '../../model/classes/doorbellEvent';
import { DoorlockEvent } from '../../model/classes/lockEvent';
import { GarageDoorEvent } from '../../model/classes/garageDoorEvent';

@Component({
	selector: 'page-events',
	templateUrl: 'events.html'
})
export class EventsPage implements OnInit, OnDestroy {

	public doorEvents: any;
	private doorEventsSubscription: Subscription;

	constructor (public helper: Helper,
		private store: Store<AppState>,
		private apiService: ApiService,
		private alertCtrl: AlertController) {

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
	 * Shows a confimation dialog for deleting all events on the sever.
	 */
	public confirmDeletion () {
		const alert = this.alertCtrl.create({
			title: 'Confirm deletion',
			message: 'Do you want to delete all events (permanently!)?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel'
				},
				{
					text: 'Delete',
					role: 'confirm',
					handler: () => {
						this.clearList();
					}
				}
			]
		});
		alert.present();
	}

	/**
	 * Returns the Class Type of a given Event object,
	 * to determine if it was a bell, door or garage event etc
	 * @param event Reference to Event object
	 */
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

	/**
	 * Click handler for "clear list" button.
	 * Dispatches Action to clear the list of Doorbell Events
	 */
	private clearList () {
		this.apiService.deleteAllEvents().subscribe(() => {
			// next block
		}, () => {
			// error block
		}, () => {
			this.store.dispatch(new DoorEvents.ClearEvents());
		});
	}

}

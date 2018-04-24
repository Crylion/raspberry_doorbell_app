import axios from 'axios';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app/app.state';
import { Injectable } from '@angular/core';
import { isUndefined } from 'ionic-angular/util/util';
import { DoorbellEvent } from '../model/classes/doorbellEvent';
import { Event } from '../model/classes/event';
import { DoorlockEvent } from '../model/classes/lockEvent';

@Injectable()
export class ApiService {

	private TIMEOUT: number = 5000;

	constructor (private store: Store<AppState>) {
	}

	public fetchAllEvents (): Observable<any> {
		return new Observable((observer) => {
			this.store.select((s: AppState) => s.serverState).subscribe((state) => {

				if (!isUndefined(state.url)) {
					Observable.fromPromise(axios({
						method: 'get',
						url: state.url + '/events',
						timeout: this.TIMEOUT
					})).subscribe((result) => {

						// Map event data to model classes
						const listOfEvents: Event[] = [];
						for (const event of result.data) {
							if ('id' in event) {
								listOfEvents.push(DoorbellEvent.factory({
									buttonId: event.id,
									dateTime: event.dateTime
								}));
							} else if ('user' in event) {
								listOfEvents.push(DoorlockEvent.factory({
									userName: event.user,
									dateTime: event.dateTime
								}));
							}
						}

						observer.next(listOfEvents);
						observer.complete();
					}, (err) => {
						observer.error(err);
					});

				} else {
					return Observable.of([]);
				}

			}).unsubscribe();
		});
	}

	public openDoor (): Observable<any> {
		return new Observable((observer) => {
			this.store.select((s: AppState) => s.serverState).subscribe((state) => {

				if (!isUndefined(state.url)) {
					Observable.fromPromise(axios({
						method: 'post',
						url: state.url + '/lock/open',
						timeout: this.TIMEOUT
					})).subscribe((results) => {
						observer.next(results.data);
						observer.complete();
					}, (err) => {
						observer.error(err);
					});

				} else {
					return Observable.of([]);
				}

			}).unsubscribe();
		});
	}

	public pingIpForServer (ip): Observable<any> {
		return new Observable((observer) => {

			Observable.fromPromise(axios({
				method: 'get',
				url: ip + '/ping',
				timeout: this.TIMEOUT
			})).subscribe((results) => {
				observer.next(results.data);
				observer.complete();
			}, (err) => {
				observer.error(err);
			});

		});
	}
}

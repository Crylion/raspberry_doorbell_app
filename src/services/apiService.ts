import axios from 'axios';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app/app.state';
import { Injectable } from '@angular/core';
import { isUndefined } from 'ionic-angular/util/util';
import { DoorbellEvent } from '../model/classes/doorbellEvent';
import { Event } from '../model/classes/event';
import { DoorlockEvent } from '../model/classes/lockEvent';
import { BELL_IDENTIFIER } from '../model/enums/bellIds.enum';

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
								let bellId = '';
								switch (event.id) {
									case 'Top':
										bellId = BELL_IDENTIFIER.TOP;
										break;
									case 'Bottom':
										bellId = BELL_IDENTIFIER.BOTTOM;
										break;
									default:
										bellId = BELL_IDENTIFIER.BOTTOM;
								}

								listOfEvents.push(DoorbellEvent.factory({
									buttonId: bellId,
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

				let userName = '';
				this.store.select((s: AppState) => s.userPreferences).subscribe((prefs) => {
					userName = prefs.username;
				}).unsubscribe();

				if (!isUndefined(state.url)) {
					Observable.fromPromise(axios({
						method: 'post',
						url: state.url + '/lock/open',
						timeout: this.TIMEOUT,
						data: {
							user: userName
						}
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

	public deleteAllEvents (): Observable<any> {
		return new Observable((observer) => {
			this.store.select((s: AppState) => s.serverState).subscribe((state) => {

				if (!isUndefined(state.url)) {
					Observable.fromPromise(axios({
						method: 'delete',
						url: state.url + '/events',
						timeout: this.TIMEOUT
					})).subscribe((results) => {
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Store } from '@ngrx/store';
import { Nav, Platform } from 'ionic-angular';

import * as DoorEvents from '../pages/doorbell/events/doorEvents.actions';
import { EventsPage } from '../pages/doorbell/events/events.component';
import { HomePage } from '../pages/home/home.component';
import { AboutPage } from '../pages/preferences/about/about';
import { ServerPreferencesPage } from '../pages/preferences/server/server';
import * as ServerState from '../pages/preferences/server/serverState.actions';
import { ApiService } from '../services/apiService';
import { AppState } from './app.state';

@Component({
	templateUrl: 'app.html'
})
export class MyApp implements OnInit {

	@ViewChild(Nav)
	public nav: Nav;

	public rootPage: any = HomePage;
	public pages: Array<{ title: string, component: any }>;

	constructor (
		private platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private oneSignal: OneSignal,
		private store: Store<AppState>,
		private apiService: ApiService) {

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Doorbell', component: EventsPage },
			{ title: 'Server Preferences', component: ServerPreferencesPage },
			{ title: 'About', component: AboutPage }
		];
	}

	public ngOnInit () {

		let serverState: any;
		this.store.select((s: AppState) => s.serverState).subscribe((state) => {
			serverState = state;
		}).unsubscribe();

		// Set online status to false by default
		this.store.dispatch(new ServerState.UpdateStatus(false));
		// Ping server with current Ip address to determine whether it is online
		this.apiService.pingIpForServer(serverState.url).subscribe((result) => {
			this.store.dispatch(new ServerState.UpdateStatus(true));
			this.store.dispatch(new ServerState.UpdateVersion(result.version));

			// Fetch door events for the first time to populate lists in home and events pages
			this.apiService.fetchAllEvents().subscribe((events) => {
				this.store.dispatch(new DoorEvents.SetEventList(events));
				this.store.dispatch(new ServerState.UpdateStatus(true));
			}, (error) => {
				this.store.dispatch(new ServerState.UpdateStatus(false));
			});
		}, (error) => {
			this.store.dispatch(new ServerState.UpdateStatus(false));
		});

		if (this.platform.is('cordova')) {
			this.initializeApp();
		}
	}

	public openPage (page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	private initializeApp () {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			// One Signal Initilization
			this.oneSignal.startInit('45ac3327-f972-4067-85d0-ec8ac1cfbdb4', '811081666028');

			this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
			this.oneSignal.enableSound(true);
			this.oneSignal.enableVibrate(true);

			this.oneSignal.handleNotificationReceived().subscribe((notification: OSNotification) => {
				// do something when notification is received
				console.log('notification received! ' + JSON.stringify(notification));
			});

			this.oneSignal.handleNotificationOpened().subscribe(() => {
				// do something when a notification is opened
				console.log('notification opened!');
			});

			this.oneSignal.endInit();
		});
	}

}

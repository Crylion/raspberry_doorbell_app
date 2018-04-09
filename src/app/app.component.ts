import { Component, ViewChild, NgZone } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Store } from '@ngrx/store';
import { Nav, Platform } from 'ionic-angular';

import { EventsPage } from '../pages/doorbell/events/events.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AppState } from './app.state';
import * as DoorbellEvents from '../pages/doorbell/events/doorbellEvents.actions';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	@ViewChild(Nav)
	public nav: Nav;

	public rootPage: any = EventsPage;
	public pages: Array<{ title: string, component: any }>;

	constructor (
		private platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private oneSignal: OneSignal,
		private store: Store<AppState>,
		private ngZone: NgZone) {

		if (this.platform.is('cordova')) {
			this.initializeApp();
		}

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'List', component: ListPage },
			{ title: 'Doorbell', component: EventsPage }
		];

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
				this.ngZone.run(() => {
					this.store.dispatch(new DoorbellEvents.AddEvent(new Date()));
				});
			});

			this.oneSignal.handleNotificationOpened().subscribe(() => {
				// do something when a notification is opened
				console.log('notification opened!');
			});

			this.oneSignal.endInit();
		});
	}

}

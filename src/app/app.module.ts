import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { storeSync } from '../services/persistence';
import { reducers } from './app.reducers';
import { EventsPage } from '../pages/doorbell/events/events.component';
import { Helper } from '../services/helper';

export function localStorageSyncReducer (reducer: ActionReducer<any>): ActionReducer<any> {
	return storeSync()(reducer);
}

export const metaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer];

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		ListPage,
		EventsPage
	],
	imports: [
		BrowserModule,
		StoreModule.forRoot(
			reducers,
			{ metaReducers }),
		StoreDevtoolsModule.instrument({ maxAge: 30 }),
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		ListPage,
		EventsPage
	],
	providers: [
		Helper,
		StatusBar,
		SplashScreen,
		OneSignal,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }

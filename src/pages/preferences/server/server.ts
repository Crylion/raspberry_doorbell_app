import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiService } from '../../../services/apiService';
import * as ServerState from './serverState.actions';
import * as UserPreferences from '../userPreferences.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/app.state';
import { Subscription } from 'rxjs';
import { BELL_IDENTIFIER } from '../../../model/enums/bellIds.enum';
import { isUndefined } from 'ionic-angular/util/util';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
	selector: 'page-server',
	templateUrl: 'server.html'
})
export class ServerPreferencesPage implements OnInit, OnDestroy {

	public ipInput: string;
	public userNameInput: string;
	public busyCheckingIp: boolean;
	public serverState: any;

	public bellPreferences: {
		type: BELL_IDENTIFIER,
		active: boolean;
	}[];

	private stateSubscription: Subscription;
	private userPreferencesSubscription: Subscription;

	constructor (public navCtrl: NavController,
		private apiService: ApiService,
		private store: Store<AppState>,
		private oneSignal: OneSignal) {

		this.serverState = {};
	}

	public ngOnInit () {
		this.bellPreferences = [
			{
				type: BELL_IDENTIFIER.TOP,
				active: true
			},
			{
				type: BELL_IDENTIFIER.BOTTOM,
				active: true
			}
		];

		this.stateSubscription = this.store.select((s: AppState) => s.serverState).subscribe((state) => {
			this.serverState = state;
			this.ipInput = state.url;
		});

		this.userPreferencesSubscription = this.store.select((s: AppState) => s.userPreferences).subscribe((prefs) => {
			this.userNameInput = prefs.username;
			for (const bellPref of this.bellPreferences) {
				bellPref.active = prefs.bellPreference.some((i) => {
					return i === bellPref.type;
				});
			}
		});
	}

	public ngOnDestroy () {
		this.stateSubscription.unsubscribe();
		this.userPreferencesSubscription.unsubscribe();
	}

	public checkIp () {
		this.busyCheckingIp = true;

		if (this.ipInput.indexOf('http://') === -1) {
			if (this.ipInput.indexOf('https://') !== -1) {
				this.ipInput = this.ipInput.replace('https://', 'http://');
			} else {
				this.ipInput = 'http://' + this.ipInput;
			}
		}

		if (this.ipInput.indexOf(':2342') === -1) {
			this.ipInput = this.ipInput + ':2342';
		}

		this.apiService.pingIpForServer(this.ipInput).subscribe((result) => {
			this.store.dispatch(new ServerState.UpdateUrl(this.ipInput));
			this.store.dispatch(new ServerState.UpdateStatus(true));
			this.store.dispatch(new ServerState.UpdateVersion(result.version));
			this.busyCheckingIp = false;
		}, (error) => {
			this.store.dispatch(new ServerState.UpdateStatus(false));
			this.busyCheckingIp = false;
		});
	}

	public toggleBell (bell: any) {
		if (!isUndefined(bell)) {
			bell.active = !bell.active;
		}
	}

	public saveUserPreferences (userName: string, bellPreference: any) {
		const activeBells = bellPreference.slice().filter((bell) => {
			return bell.active;
		});
		const activeBellsIdentifier = activeBells.map((bell) => {
			return bell.type;
		});

		const tagObject = {
			'Top': 'false',
			'Bottom': 'false'
		};
		for (const bellId of activeBellsIdentifier) {
			tagObject[bellId] = 'true';
		}

		this.store.dispatch(new UserPreferences.UpdateUsername(userName));
		this.store.dispatch(new UserPreferences.UpdateBellPrefs(activeBellsIdentifier));

		this.oneSignal.sendTags(tagObject);
	}

}

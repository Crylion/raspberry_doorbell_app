import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiService } from '../../../services/apiService';
import * as ServerState from './serverState.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app/app.state';
import { Subscription } from 'rxjs';

@Component({
	selector: 'page-server',
	templateUrl: 'server.html'
})
export class ServerPreferencesPage implements OnInit, OnDestroy {

	public ipInput: string;
	public busyCheckingIp: boolean;
	public serverState: any;

	private stateSubscription: Subscription;

	constructor (public navCtrl: NavController,
		private apiService: ApiService,
		private store: Store<AppState>) {

		this.serverState = {};
	}

	public ngOnInit () {
		this.stateSubscription = this.store.select((s: AppState) => s.serverState).subscribe((state) => {
			this.serverState = state;
			this.ipInput = state.url;
		});
	}

	public ngOnDestroy () {
		this.stateSubscription.unsubscribe();
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

}

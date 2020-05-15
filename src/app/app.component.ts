import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService, ConnectionStatus } from './core/services/network/network.service';
import { OfflineManagerService } from './core/services/offline-manager/offline-manager.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService
  ) {
    this.initializeApp();
    localStorage.clear();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });
    });
  }
}

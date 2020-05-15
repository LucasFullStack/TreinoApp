import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService, ConnectionStatus } from './core/services/network/network.service';
import { OfflineManagerService } from './core/services/offline-manager/offline-manager.service';
import { AuthenticationService } from './core/services/auth/authentication.service';
import { AlertService } from './core/services/alert/alert.service';


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
    private offlineManager: OfflineManagerService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        this.authenticationService.isAuthorized()
        .subscribe((isAuth) => {
          if (status == ConnectionStatus.Online && isAuth) {
            this.offlineManager.checkForEvents()
            .toPromise()
            .catch(()=> this.presentAlert() )
          }
        });
      });
    });
  }
  
  presentAlert(){
    this.alertService.presentErrorAlertDefault("Atenção!","Não foi possível terminar de sincronizar os dados. Caso o problema persista entre em contato com o administrador!")
  }
}

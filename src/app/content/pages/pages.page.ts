import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Menu } from 'src/app/core/models/menu/menu';
import { NavController, Platform } from '@ionic/angular';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { UsuarioDisplay } from 'src/app/core/models/usuarios/usuario-display';
import { Subscription } from 'rxjs';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OfflineManagerService } from 'src/app/core/services/offline-manager/offline-manager.service';

let _checkRouteEvents$: Subscription = new Subscription();


@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {
  appTabPages: Menu[];
  usuarioDisplay: UsuarioDisplay = new UsuarioDisplay();
  currentRouteUrl: string = this.router.url.split(/[?#]/)[0];
  versionNumber: string;

  constructor(private router: Router,
    public navCtrl: NavController,
    private menuService: MenuService,
    private platform: Platform,
    private appVersion: AppVersion,
    private offlineManagerService: OfflineManagerService) { }

  ngOnInit() {
    this.checkRouteEvents();
    this.exitApp();
    this.getMenuTabs();
    this.getVersao();
  }

  ngOnDestroy(){
    _checkRouteEvents$.unsubscribe();

  }

  checkRouteEvents() {
    _checkRouteEvents$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
      });
  }

  getMenuTabs(){
    this.menuService.getTabsMenu()
           .then((data)=>{
             this.appTabPages = data;
           });
   }

  exitApp() {
    this.platform.backButton.subscribe(() => {
      if (this.currentRouteUrl.endsWith("treinos")) {
        navigator['app'].exitApp();
      }
    });
  }

  async openPage(menu: Menu) {

    this.navCtrl.navigateForward([menu.url])
  }

  async getVersao(){
    await this.appVersion.getVersionNumber()
    .then((versaoNumber: string) => this.versionNumber = versaoNumber);
  }

  isActive(url: string): boolean {
    if (!url) { return; }
    if (this.currentRouteUrl === url) {
      return true;
    }
    return false;
  }

}

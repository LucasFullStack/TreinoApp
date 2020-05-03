import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Menu } from 'src/app/core/models/menu/menu';
import { NavController, Platform } from '@ionic/angular';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { UsuarioDisplay } from 'src/app/core/models/usuarios/usuario-display';
import { Subscription } from 'rxjs';
import { UsuariosService } from 'src/app/core/services/usuarios/usuarios.service';

let _checkRouteEvents$: Subscription = new Subscription();
let _getUsuarioDisplay$: Subscription = new Subscription();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit, OnDestroy {
  appTabPages: Menu[];
  appSidePages: Menu[];
  usuarioDisplay: UsuarioDisplay = new UsuarioDisplay();
  currentRouteUrl: string = this.router.url.split(/[?#]/)[0];

  constructor(private router: Router,
    public navCtrl: NavController,
    private menuService: MenuService,
    private platform: Platform,
    private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.checkRouteEvents();
    this.exitApp();
    this.getMenuTabs();
    this.getMenuSide()
    this.getUsuarioDisplay();
  }

  ngOnDestroy(){
    _checkRouteEvents$.unsubscribe();
    _getUsuarioDisplay$.unsubscribe();
  }
  
  getUsuarioDisplay(){
    _getUsuarioDisplay$ = this.usuariosService.getUsuarioDisplay(true)
                                       .subscribe((data)=>{
                                         if(data){
                                           this.usuarioDisplay = data.dados[0];
                                         }
                                         console.log(data)
                                       })
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

   getMenuSide(){
    this.menuService.getSideMenu()
           .then((data)=>{
             this.appSidePages = data;
           });
   }

  exitApp() {
    this.platform.backButton.subscribe(() => {
      if (this.currentRouteUrl.endsWith("treinos")) {
        navigator['app'].exitApp();
      }
    });
  }

  isActive(url: string): boolean {
    if (!url) { return; }
    if (this.currentRouteUrl === url) {
      return true;
    }
    return false;
  }

}

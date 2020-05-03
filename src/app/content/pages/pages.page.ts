import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Menu } from 'src/app/core/models/menu/menu';
import { NavController, Platform } from '@ionic/angular';
import { MenuService } from 'src/app/core/services/menu/menu.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  appTabPages: Menu[];
  currentRouteUrl: string = this.router.url.split(/[?#]/)[0];

  constructor(private router: Router,
    public navCtrl: NavController,
    private menuService: MenuService,
    private platform: Platform) { }

  ngOnInit() {
    this.checkRouteEvents();
    this.exitApp();
    this.getMenuTabs();
  }

  checkRouteEvents() {
    this.router.events
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

  isActive(url: string): boolean {
    if (!url) { return; }
    if (this.currentRouteUrl === url) {
      return true;
    }
    return false;
  }

}

import { Injectable } from '@angular/core';
import { Menu } from '../../models/menu/menu';
import { menu } from './../../../content/config/menu';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  appPages: Menu[] = menu;

  constructor() { }

  async getTabsMenu(){
    let result = this.appPages = await menu
                   .sort((m1,m2) =>  m1.order - m2.order)
                   .filter((x=> x.typeMenu === 'Tabs' && x.ativo == true));
                    return  result;
  }

  async getSideMenu(){
    let result = this.appPages = await menu
                   .sort((m1,m2) =>  m1.order - m2.order)
                   .filter((x=> x.typeMenu === 'Side' && x.ativo == true));
                    return  result;
  }
}

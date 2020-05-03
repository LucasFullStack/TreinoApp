import { Menu } from './../../core/models/menu/menu';

export let menu: Menu[] = [
  {
    typeMenu: 'Side',
    order: 3,
    title: 'Sincronizar',
    url: null,
    icon:'sync',
    ativo: true
  },
  {
    typeMenu: 'Side',
    order: 99,
    title: 'Sair',
    url: null,
    icon: 'flaticon-power',
    ativo: true
  },
  {
    typeMenu: 'Tabs',
    order: 1,
    title: 'Treinos',
    url: '/treinos',
    icon: 'home',
    ativo: true
  }
]
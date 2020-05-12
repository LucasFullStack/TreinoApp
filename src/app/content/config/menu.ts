import { Menu } from './../../core/models/menu/menu';

export let menu: Menu[] = [
  {
    typeMenu: 'Tabs',
    order: 1,
    title: 'Treinos',
    url: '/treinos',
    icon: 'barbell-outline',
    ativo: true
  },
  {
    typeMenu: 'Tabs',
    order: 1,
    title: 'Conta',
    url: '/conta',
    icon: 'person',
    ativo: true
  }
]
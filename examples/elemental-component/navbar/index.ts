import { Navbar, NavbarItem, NavbarMenu, State } from './Navbar';

export * from './Navbar';

const menu: NavbarMenu = {
  start: [NavbarItem.from('Batman🦇'), NavbarItem.from('Robin🐦'), NavbarItem.from('Cat Woman🐱')],
  end: [NavbarItem.from('Login'), NavbarItem.from('Signup')],
};

export const navbar = new Navbar({ state: State.from<NavbarMenu, State>(menu) });

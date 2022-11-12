import { NavbarItem, Navbar, NavbarMenu } from './Navbar';

const menu: NavbarMenu = {
  start: [NavbarItem.from('Batman🦇'), NavbarItem.from('Robin🐦'), NavbarItem.from('Cat Woman🐱')],
  end: [NavbarItem.from('Login'), NavbarItem.from('Signup')],
};

export const navbar = new Navbar({ state: menu });

// 👌 add the custom element to the document body to render
document.body.prepend(navbar);

import './inheritance';
import { Navbar, NavbarItem, NavbarMenu, State } from './navbar';

// Initialize the elemental components
const menu: NavbarMenu = {
  start: [NavbarItem.from('Batman🦇'), NavbarItem.from('Robin🐦'), NavbarItem.from('Cat Woman🐱')],
  end: [NavbarItem.from('Login'), NavbarItem.from('Signup')],
};

const navbar = new Navbar({ state: State.from<NavbarMenu, State>(menu) });

// 👌 add the components to the document body to render
document.body.prepend(navbar);

document.body.innerHTML += `
<el-hero id="one" name="Batman🦇" tagline="The protector of Gotham!"></el-hero>
<el-hero-sidekick name="Robin🐦" tagline="I was lost, but now I am found."></el-hero-sidekick>
<el-hero-sidekick name="Cat Woman🐱" tagline="I ❤ Batman"></el-hero-sidekick>
`;

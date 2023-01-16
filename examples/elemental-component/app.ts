import './inheritance';
import { navbar } from './navbar';
import { magician } from './magician';

// 👌 add the components to the document body to render
document.body.prepend(navbar);

document.body.innerHTML += `
<div style="display: flex; margin-top: 4%;">
    <p>Hello World! This is a regular paragraph, not an elemental component.</p>
</div>
<hr />
`;

document.body.appendChild(magician);

document.body.innerHTML += `
<hr />
<div style="display: flex; justify-content: center; column-gap: 5%">
  <el-hero id="one" name="Batman🦇" tagline="The protector of Gotham!"></el-hero>
  <el-hero-sidekick name="Robin🐦" tagline="I was lost, but now I am found."></el-hero-sidekick>
  <el-hero-sidekick name="Cat Woman🐱" tagline="I ❤ Batman"></el-hero-sidekick>
</div>
`;

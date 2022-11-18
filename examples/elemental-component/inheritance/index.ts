import './Hero';
import './HeroSidekick';

// 👌 add the custom element to the document body to render
document.body.innerHTML += `
<el-hero id="one" name="Batman🦇"
                  tagline="The protector of Gotham!">
</el-hero>
<el-hero-sidekick name="Robin🐦"
                  tagline="I was lost, but now I am found.">
</el-hero-sidekick>
<el-hero-sidekick tagline="I ❤ Batman">
</el-hero-sidekick>
`;

import { Magician } from './Magician';
import { MagicianName, MagicianStateData, MagicianSuperPower, State } from './State';

export * from './Magician';
export * from './State';

export const magician = new Magician({
  state: State.from<MagicianStateData, State>({
    name: MagicianName.from('Dr. Strange'),
    superpower: MagicianSuperPower.from('The Mystic Art'),
  }),
});

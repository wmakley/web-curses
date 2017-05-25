import * as Command from './Command';
import { Game } from './Game';

export interface ActorClass {
  className: string
  name: string
  description: string
  char: string
  color: string
  update: (game: Game) => Array<Command.Command>
}

export const Player: ActorClass = {
  className: 'Player',
  name: 'Player',
  description: 'This is you.',
  char: '@',
  color: '#FFFFFF',
  update: (game: Game) => undefined
}

export const HugeHollow: ActorClass = {
  className: 'HugeHollow',
  name: 'Huge Hollow',
  description: 'It is a huge hollow. It is very scary.',
  char: 'H',
  color: '#FF0000',
  update: (game: Game) => {
    return [
      new Command.ShowMessage("The huge hollow looks at you!")
    ]
  }
}

let classes: { [name: string]:ActorClass } = { };
classes[Player.className] = Player;
classes[HugeHollow.className] = HugeHollow;

export function getClassByName(name: string) {
  return classes[name];
}

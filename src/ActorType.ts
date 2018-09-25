import * as Command from './Command';
import { GameState } from './GameState';

export interface ActorType {
  id: string
  name: string
  description: string
  char: string
  color: string
  update: (state: GameState) => Array<Command.Command>
}

export const Player: ActorType = {
  id: 'Player',
  name: 'Player',
  description: 'This is you.',
  char: '@',
  color: '#FFFFFF',
  update: (state: GameState) => undefined
}

export const HugeHollow: ActorType = {
  id: 'HugeHollow',
  name: 'Huge Hollow',
  description: 'It is a huge hollow. It is very scary.',
  char: 'H',
  color: '#FF0000',
  update: (state: GameState) => {
    return undefined;
    // return [
    //   new Command.ShowMessage("The huge hollow looks at you!")
    // ]
  }
}

let classes: { [id: string]:ActorType } = { };
classes[Player.id] = Player;
classes[HugeHollow.id] = HugeHollow;

export function getClassById(id: string) {
  return classes[id];
}

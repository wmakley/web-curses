import * as Command from './Command';
import { GameState } from './GameState';

export interface ActorType {
  typeName: string
  name: string
  description: string
  char: string
  color: string
  update: (state: GameState) => Array<Command.Command>
}

export const Player: ActorType = {
  typeName: 'Player',
  name: 'Player',
  description: 'This is you.',
  char: '@',
  color: '#FFFFFF',
  update: (state: GameState) => undefined
}

export const HugeHollow: ActorType = {
  typeName: 'HugeHollow',
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

let classes: { [typeName: string]:ActorType } = { };
classes[Player.typeName] = Player;
classes[HugeHollow.typeName] = HugeHollow;

export function getClassByName(name: string) {
  return classes[name];
}

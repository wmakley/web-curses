export interface ActorClass {
  className: string,
  name: string,
  description: string,
  char: string,
  color: string
}

export const Player: ActorClass = {
  className: 'Player',
  name: 'Player',
  description: 'This is you.',
  char: '@',
  color: '#FFFFFF'
}


export const HugeHollow: ActorClass = {
  className: 'HugeHollow',
  name: 'Huge Hollow',
  description: 'It is a huge hollow. It is very scary.',
  char: 'H',
  color: '#FF0000',
}

let classes: { [name: string]:ActorClass } = { };
classes[Player.className] = Player;
classes[HugeHollow.className] = HugeHollow;

export function getClassByName(name: string) {
  return classes[name];
}

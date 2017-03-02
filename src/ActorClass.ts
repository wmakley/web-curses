export interface ActorClass {
  className: string,
  name: string,
  description: string,
  char: string,
  color: string
}

let classes: { [name: string]:ActorClass } = { };

export let Player: ActorClass = {
  className: 'Player',
  name: 'Player',
  description: 'Player',
  char: '@',
  color: '#FFFFFF'
}


export let RedDragon: ActorClass = {
  className: 'RedDragon',
  name: 'Red Dragon',
  description: 'Red Dragon',
  char: 'D',
  color: '#FF0000',
}

classes[Player.className] = Player;
classes[RedDragon.className] = RedDragon;

export function getClassByName(name: string) {
  return classes[name];
}

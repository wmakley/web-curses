import { Command } from './Command';

/**
* keyCode to key mappings
*/
export const CODES: { [code: number]: string; } = {
  13: 'Enter',
  27: 'Escape',
  32: ' ',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  66: 'b',
  72: 'h',
  74: 'j',
  75: 'k',
  76: 'l',
  78: 'n',
  85: 'u',
  89: 'y'
}

/**
* Half-assed polyfill for KeyboardEvent.key, which Safari doesn't support
*/
export function getKey(event: KeyboardEvent) {
  if (typeof event.key === 'string') {
    return event.key;
  }

  const code = event.keyCode || event.which || event.charCode;
  if (code === undefined || code === null) { return undefined; }
  return CODES[code];
}


export interface EventHandler {
  remove: () => undefined
}

/**
 * Create a new KeyboardEvent handler that detects keyboard events
 * in the current window and maps them to commands.
 * @param mappings
 * @param onInput
 */
export function createEventHandler(
  eventTarget: any,
  mappings: { [key: string]: Command },
  onInput: (command: Command) => void)
{
  function listener(event: KeyboardEvent) {
    const key = getKey(event);
    if (key === undefined) return;
    // if (this.debug) console.log("keydown : '" + key + "'");
    const command = mappings[key];
    if (command !== undefined) {
      event.preventDefault();
      onInput(command);
    }
  };

  eventTarget.addEventListener('keydown', listener);

  return <EventHandler>{
    remove: function () {
      return eventTarget.removeEventListener('keydown', listener);
    }
  };
}

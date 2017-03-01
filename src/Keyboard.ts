/**
 * keyCode to key mappings
 */
export var CODES: { [code: number]: string; } = {
  13: 'Enter',
  27: 'Escape',
  32: ' ',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown'
}

/**
 * Half-assed polyfill for KeyboardEvent.key, which Safari doesn't support
 */
export function getKey(event: KeyboardEvent) {
  if (typeof event.key === 'string') {
    return event.key;
  }

  let code = event.keyCode || event.which || event.charCode;
  if (!code) return null;
  return CODES[code] || null;
}
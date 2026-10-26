// Log con hora (hh:mm:ss.mmm) para poder demostrar el orden de los eventos 
export function log(...args: unknown[]) {
  const hora = new Date().toISOString().slice(11, 23)
  console.log(`[${hora}]`, ...args)
}
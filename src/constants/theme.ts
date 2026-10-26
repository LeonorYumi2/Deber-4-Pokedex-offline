export const colores = {
  fondo: '#0D1117',
  superficie: '#161B22',
  superficieAlta: '#1E2530',
  borde: '#262D38',
  texto: '#E6EDF3',
  textoSuave: '#8B96A5',
  online: '#3FB950',
  offline: '#E5534B',
  pendiente: '#F2A93B',
}

// Colores oficiales de los 18 tipos
export const colorTipo: Record<string, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
}

// Si no se conoce el tipo (p. ej. sin red y nunca visto), gris neutro
export const colorDeTipo = (tipo?: string) =>
  (tipo && colorTipo[tipo]) || colores.textoSuave
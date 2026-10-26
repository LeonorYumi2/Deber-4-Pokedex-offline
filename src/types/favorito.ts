export interface Favorito {
  id: string          // lo asigna MockAPI (temporal "temp-N" mientras está pendiente)
  pokemonId: number
  nombre: string
  sprite: string
  nota: string
  creadoEn: string
  pendiente?: boolean // solo en la app: aún no confirmado por el servidor
}

// Lo que enviamos a MockAPI (sin id ni campos locales)
export type FavoritoInput = Omit<Favorito, 'id' | 'pendiente'>
export interface PokemonResumen {
  id: number
  nombre: string
  sprite: string
}

// Lo que mostramos en la pantalla de detalle
export interface PokemonDetalle {
  id: number
  nombre: string
  sprite: string
  imagen: string
  tipos: string[]
  altura: number
  peso: number
  stats: { nombre: string; valor: number }[]
}
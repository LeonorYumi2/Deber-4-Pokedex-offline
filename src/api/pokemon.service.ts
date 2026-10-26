import { pokeClient } from './clients'
import type { PokemonDetalle, PokemonResumen } from '../types/pokemon'

const SPRITE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export const pokemonService = {
  // Los primeros 151 en una sola petición (más simple de cachear)
  getLista: async (): Promise<PokemonResumen[]> => {
    const { data } = await pokeClient.get('pokemon', { params: { limit: 151 } })
    return data.results.map((p: { name: string; url: string }) => {
      // la url termina en .../pokemon/25/ 
      const id = Number(p.url.split('/').filter(Boolean).pop())
      return { id, nombre: p.name, sprite: `${SPRITE_URL}/${id}.png` }
    })
  },

  getDetalle: async (id: number): Promise<PokemonDetalle> => {
    const { data } = await pokeClient.get(`pokemon/${id}`)
    return {
      id: data.id,
      nombre: data.name,
      sprite: `${SPRITE_URL}/${data.id}.png`,
      imagen:
        data.sprites?.other?.['official-artwork']?.front_default ??
        `${SPRITE_URL}/${data.id}.png`,
      tipos: data.types.map((t: any) => t.type.name),
      altura: data.height,
      peso: data.weight,
      stats: data.stats.map((s: any) => ({
        nombre: s.stat.name,
        valor: s.base_stat,
      })),
    }
  },
}
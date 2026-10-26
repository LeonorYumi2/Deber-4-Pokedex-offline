import { useQuery } from '@tanstack/react-query'
import { pokemonService } from '../api/pokemon.service'
import { queryKeys } from '../api/queryKeys'
import { cacheTimes } from '../api/cache'
import { log } from '../utils/log'

export function usePokemonLista() {
  return useQuery({
    queryKey: queryKeys.pokemon.lista(),
    queryFn: () => {
      log('GET PokeAPI → lista')
      return pokemonService.getLista()
    },
    ...cacheTimes.pokemon,
  })
}

export function usePokemonDetalle(id: number) {
  return useQuery({
    queryKey: queryKeys.pokemon.detalle(id),
    queryFn: () => {
      log('GET PokeAPI → detalle', id)
      return pokemonService.getDetalle(id)
    },
    ...cacheTimes.pokemon,
  })
}
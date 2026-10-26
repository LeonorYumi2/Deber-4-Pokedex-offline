import { useMutation, useQuery } from '@tanstack/react-query'
import { favoritosService } from '../api/favoritos.service'
import { mutationKeys, queryKeys } from '../api/queryKeys'
import { cacheTimes } from '../api/cache'
import type { EditarVars } from '../api/mutations'
import type { Favorito, FavoritoInput } from '../types/favorito'
import { log } from '../utils/log'

export function useFavoritosLista() {
  return useQuery({
    queryKey: queryKeys.favoritos.lista(),
    queryFn: () => {
      log('GET MockAPI → favoritos')
      return favoritosService.getAll()
    },
    ...cacheTimes.favoritos,
  })
}

// La mutationFn, el onMutate, etc. vienen de setMutationDefaults (mutations.ts):
// aquí solo indicamos QUÉ mutación es, con su clave
export function useCrearFavorito() {
  return useMutation<Favorito, Error, FavoritoInput>({
    mutationKey: mutationKeys.crearFavorito,
  })
}

export function useEditarFavorito() {
  return useMutation<Favorito, Error, EditarVars>({
    mutationKey: mutationKeys.editarFavorito,
  })
}
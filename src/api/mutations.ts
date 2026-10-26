import type { QueryClient } from '@tanstack/react-query'
import { favoritosService } from './favoritos.service'
import { mutationKeys, queryKeys } from './queryKeys'
import { log } from '../utils/log'
import type { Favorito, FavoritoInput } from '../types/favorito'

export interface EditarVars {
  id: string
  data: FavoritoInput
}

// Lo que onMutate guarda para poder revertir si algo falla
type Contexto = { previo?: Favorito[] }

export function registrarMutaciones(qc: QueryClient) {
  const key = queryKeys.favoritos.lista()

  // Crear favorito 
  qc.setMutationDefaults<Favorito, Error, FavoritoInput, Contexto>(
    mutationKeys.crearFavorito,
    {
      mutationFn: (vars) => {
        log('POST MockAPI → favorito', vars.pokemonId)
        return favoritosService.add(vars)
      },
      // Se ejecuta al lanzar la mutación (con o sin red): muestra el cambio ya
      onMutate: async (vars) => {
        await qc.cancelQueries({ queryKey: key })
        const previo = qc.getQueryData<Favorito[]>(key)
        qc.setQueryData<Favorito[]>(key, (old = []) => [
          ...old,
          { ...vars, id: `temp-${vars.pokemonId}`, pendiente: true },
        ])
        return { previo }
      },
      onError: (_error, _vars, ctx) => {
        log('POST falló → se revierte el cambio')
        if (ctx?.previo) qc.setQueryData(key, ctx.previo)
      },
      // Éxito o error: se vuelve a pedir la lista real al servidor
      onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
    },
  )

  // Editar favorito 
  qc.setMutationDefaults<Favorito, Error, EditarVars, Contexto>(
    mutationKeys.editarFavorito,
    {
      mutationFn: ({ id, data }) => {
        log('PUT MockAPI → favorito', id)
        return favoritosService.update(id, data)
      },
      onMutate: async ({ id, data }) => {
        await qc.cancelQueries({ queryKey: key })
        const previo = qc.getQueryData<Favorito[]>(key)
        qc.setQueryData<Favorito[]>(key, (old = []) =>
          old.map((f) => (f.id === id ? { ...f, ...data, pendiente: true } : f)),
        )
        return { previo }
      },
      onError: (_error, _vars, ctx) => {
        log('PUT falló → se revierte el cambio')
        if (ctx?.previo) qc.setQueryData(key, ctx.previo)
      },
      onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
    },
  )
}
import axios from 'axios'
import { onlineManager, type QueryClient } from '@tanstack/react-query'
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

const estadoRed = () =>
  onlineManager.isOnline() ? 'con red' : 'SIN RED → queda pendiente'

// Texto corto del motivo, para que el log explique el fallo
const motivo = (error: Error) =>
  axios.isAxiosError(error) && error.response
    ? `HTTP ${error.response.status}`
    : error.message

// Al reconectar, el sistema a veces avisa "hay red" unos instantes antes de que
// internet responda de verdad. Si la petición falla SIN respuesta del servidor
// (fallo de red) se reintenta; si el servidor respondió con un error (400, 500...)
// reintentar no tiene sentido.
const reintentarSiFalloDeRed = (fallos: number, error: Error) => {
  const esFalloDeRed = axios.isAxiosError(error) && !error.response
  if (esFalloDeRed && fallos < 4) {
    log(`Fallo de red (${error.message}) → reintento ${fallos + 1}/4`)
    return true
  }
  return false
}

// Espera creciente entre reintentos: 1 s, 2 s, 4 s, 8 s
const esperaReintento = (intento: number) =>
  Math.min(1000 * 2 ** intento, 8000)

export function registrarMutaciones(qc: QueryClient) {
  const key = queryKeys.favoritos.lista()

  // ── Crear favorito ─────────────────────────────
  qc.setMutationDefaults<Favorito, Error, FavoritoInput, Contexto>(
    mutationKeys.crearFavorito,
    {
      retry: reintentarSiFalloDeRed,
      retryDelay: esperaReintento,
      mutationFn: (vars) => {
        log('POST MockAPI → favorito', vars.pokemonId)
        return favoritosService.add(vars)
      },
      onMutate: async (vars) => {
        log(`Crear favorito #${vars.pokemonId} (${estadoRed()})`)
        await qc.cancelQueries({ queryKey: key })
        const previo = qc.getQueryData<Favorito[]>(key)
        qc.setQueryData<Favorito[]>(key, (old = []) => [
          ...old,
          { ...vars, id: `temp-${vars.pokemonId}`, pendiente: true },
        ])
        return { previo }
      },
      onSuccess: (data) => {
        log('POST confirmado por MockAPI → id', data.id)
      },
      onError: (error, _vars, ctx) => {
        log(`POST falló (${motivo(error)}) → se revierte el cambio`)
        if (ctx?.previo) qc.setQueryData(key, ctx.previo)
      },
      onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
    },
  )

  // ── Editar favorito ────────────────────────────
  qc.setMutationDefaults<Favorito, Error, EditarVars, Contexto>(
    mutationKeys.editarFavorito,
    {
      retry: reintentarSiFalloDeRed,
      retryDelay: esperaReintento,
      mutationFn: ({ id, data }) => {
        log('PUT MockAPI → favorito', id)
        return favoritosService.update(id, data)
      },
      onMutate: async ({ id, data }) => {
        log(`Editar nota del favorito ${id} (${estadoRed()})`)
        await qc.cancelQueries({ queryKey: key })
        const previo = qc.getQueryData<Favorito[]>(key)
        qc.setQueryData<Favorito[]>(key, (old = []) =>
          old.map((f) => (f.id === id ? { ...f, ...data, pendiente: true } : f)),
        )
        return { previo }
      },
      onSuccess: (data) => {
        log('PUT confirmado por MockAPI → id', data.id)
      },
      onError: (error, _vars, ctx) => {
        log(`PUT falló (${motivo(error)}) → se revierte el cambio`)
        if (ctx?.previo) qc.setQueryData(key, ctx.previo)
      },
      onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
    },
  )
}
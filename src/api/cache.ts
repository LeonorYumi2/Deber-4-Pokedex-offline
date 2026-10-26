import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { registrarMutaciones } from './mutations'

const SEGUNDO = 1000
const DIA = 24 * 60 * 60 * SEGUNDO

export const PERSIST_MAX_AGE = 7 * DIA

export const cacheTimes = {
  pokemon: { staleTime: DIA, gcTime: 14 * DIA },
  favoritos: { staleTime: 30 * SEGUNDO, gcTime: PERSIST_MAX_AGE },
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: PERSIST_MAX_AGE },
    // Las mutaciones pausadas también deben sobrevivir a que pase el tiempo
    mutations: { gcTime: PERSIST_MAX_AGE },
  },
})

// IMPORTANTE: se registra aquí, al cargar el módulo, para que esté listo
// ANTES de que se restaure la caché desde disco
registrarMutaciones(queryClient)

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'POKEDEX_CACHE',
  throttleTime: 500,
})
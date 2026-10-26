import { Stack } from 'expo-router'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { View } from 'react-native'
import { queryClient, persister, PERSIST_MAX_AGE } from '../api/cache'
import { configurarOnlineManager } from '../api/online'
import { queryKeys } from '../api/queryKeys'
import { log, cargarLogsGuardados } from '../utils/log'
import { colores } from '../constants/theme'
import { LogPanel } from '../components/LogPanel'
import type { PokemonResumen } from '../types/pokemon'
import type { Favorito } from '../types/favorito'

configurarOnlineManager()
cargarLogsGuardados()

export default function Layout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: PERSIST_MAX_AGE, buster: 'v2' }}
      onSuccess={() => {
        // La caché ya se restauró desde disco: contamos qué había ANTES de cualquier GET
        const pokemon = queryClient.getQueryData<PokemonResumen[]>(
          queryKeys.pokemon.lista(),
        )
        const favoritos = queryClient.getQueryData<Favorito[]>(
          queryKeys.favoritos.lista(),
        )
        const pausadas = queryClient
          .getMutationCache()
          .getAll()
          .filter((m) => m.state.isPaused).length
        log(
          `Caché restaurada desde disco → ${pokemon?.length ?? 0} pokémon, ` +
            `${favoritos?.length ?? 0} favoritos, ${pausadas} mutación(es) pausada(s)`,
        )
        // Reintenta lo que quedó pendiente de la sesión anterior
        queryClient
          .resumePausedMutations()
          .then(() =>
            queryClient.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
          )
      }}
    >
      <View style={{ flex: 1, backgroundColor: colores.fondo }}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <LogPanel />
      </View>
    </PersistQueryClientProvider>
  )
}
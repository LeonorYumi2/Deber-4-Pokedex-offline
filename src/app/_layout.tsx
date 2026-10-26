import { Stack } from 'expo-router'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, persister, PERSIST_MAX_AGE } from '../api/cache'
import { configurarOnlineManager } from '../api/online'
import { queryKeys } from '../api/queryKeys'
import { log } from '../utils/log'

configurarOnlineManager()

export default function Layout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: PERSIST_MAX_AGE, buster: 'v2' }}
      onSuccess={() => {
        // La caché ya se restauró: reintenta lo que quedó pendiente de la sesión anterior
        log('Caché restaurada → reanudando mutaciones pausadas')
        queryClient
          .resumePausedMutations()
          .then(() =>
            queryClient.invalidateQueries({ queryKey: queryKeys.favoritos.all }),
          )
      }}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </PersistQueryClientProvider>
  )
}
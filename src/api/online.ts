import { onlineManager } from '@tanstack/react-query'
import * as Network from 'expo-network'
import { log } from '../utils/log'

let configurado = false
let ultimoEstado: boolean | undefined

const hayRed = (s: Network.NetworkState) =>
  Boolean(s.isConnected && s.isInternetReachable !== false)

// Solo escribe en el log cuando el estado REALMENTE cambia
function aplicar(online: boolean, setOnline: (o: boolean) => void) {
  if (online !== ultimoEstado) {
    ultimoEstado = online
    log(online ? 'RED → conectado' : 'RED → sin conexión')
  }
  setOnline(online)
}

export function configurarOnlineManager() {
  if (configurado) return
  configurado = true

  // Cada cambio de red se le comunica a TanStack Query
  onlineManager.setEventListener((setOnline) => {
    const sub = Network.addNetworkStateListener((estado) => {
      aplicar(hayRed(estado), setOnline)
    })
    return () => sub.remove()
  })

  // Estado inicial (si no, asume "online" hasta el primer cambio)
  Network.getNetworkStateAsync().then((estado) => {
    aplicar(hayRed(estado), (o) => onlineManager.setOnline(o))
  })
}
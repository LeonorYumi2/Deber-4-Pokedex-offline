import { useSyncExternalStore } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface LogEntry {
  id: string
  hora: string
  texto: string
}

const KEY = 'POKEDEX_LOGS' // aparte de la caché de TanStack
const MAX = 200

let entradas: LogEntry[] = []
let contador = 0
let cargado = false
let timer: ReturnType<typeof setTimeout> | undefined
const oyentes = new Set<() => void>()

// Hora LOCAL con milisegundos (para el video, la del teléfono)
function horaActual() {
  const d = new Date()
  const p = (n: number, l = 2) => String(n).padStart(l, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`
}

const formatear = (args: unknown[]) =>
  args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')

function notificar() {
  oyentes.forEach((l) => l())
}

// Escritura a disco con espera, y solo después de haber leído los logs previos
// (si no, podríamos pisar los de la sesión anterior)
function guardar() {
  if (!cargado) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    AsyncStorage.setItem(KEY, JSON.stringify(entradas)).catch(() => {})
  }, 300)
}

export function log(...args: unknown[]) {
  const hora = horaActual()
  const texto = formatear(args)
  console.log(`[${hora}]`, texto) // se mantiene para adb logcat
  // Inmutable: useSyncExternalStore necesita una referencia nueva en cada cambio
  entradas = [
    ...entradas.slice(-(MAX - 1)),
    { id: `${Date.now()}-${contador++}`, hora, texto },
  ]
  notificar()
  guardar()
}

// Recupera los logs de la sesión anterior y los separa con una marca
export async function cargarLogsGuardados() {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    const previos: LogEntry[] = raw ? JSON.parse(raw) : []
    if (previos.length > 0) {
      const marca: LogEntry = {
        id: `marca-${Date.now()}`,
        hora: '',
        texto: '──── nueva sesión ────',
      }
      entradas = [...previos, marca, ...entradas].slice(-MAX)
      notificar()
    }
  } catch {
    // si falla la lectura, seguimos con los logs de esta sesión
  } finally {
    cargado = true
    guardar()
  }
}

export function limpiarLogs() {
  entradas = []
  notificar()
  guardar()
}

const suscribir = (cb: () => void) => {
  oyentes.add(cb)
  return () => {
    oyentes.delete(cb)
  }
}

export function useLogs() {
  return useSyncExternalStore(suscribir, () => entradas)
}
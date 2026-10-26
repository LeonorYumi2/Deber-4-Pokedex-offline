import { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colores } from '../constants/theme'
import { limpiarLogs, useLogs, type LogEntry } from '../utils/log'
import { fuentes } from './FontGate'

const ALTURA_CERRADO = 36

function colorDelLog(texto: string) {
  const normalizado = texto.toLocaleLowerCase()

  if (normalizado.includes('sin red') || normalizado.includes('falló')) {
    return colores.offline
  }
  if (
    normalizado.includes('pendiente') ||
    normalizado.includes('pausada')
  ) {
    return colores.pendiente
  }
  if (
    normalizado.includes('confirmado') ||
    normalizado.includes('conectado')
  ) {
    return colores.online
  }
  return colores.texto
}

export function LogPanel() {
  const entradas = useLogs()
  const insets = useSafeAreaInsets()
  const [desplegado, setDesplegado] = useState(false)
  const listaRef = useRef<FlatList<LogEntry>>(null)
  const seguirAlFinal = useRef(true)
  const ultimaEntrada = entradas[entradas.length - 1]

  useEffect(() => {
    if (desplegado && seguirAlFinal.current) {
      listaRef.current?.scrollToEnd({ animated: true })
    }
  }, [desplegado, ultimaEntrada?.id])

  const manejarScroll = (evento: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = evento.nativeEvent
    const distanciaAlFinal =
      contentSize.height - layoutMeasurement.height - contentOffset.y
    seguirAlFinal.current = distanciaAlFinal < 48
  }

  const mostrarPanel = () => {
    seguirAlFinal.current = true
    setDesplegado(true)
  }

  return (
    <View
      style={[
        styles.panel,
        desplegado
          ? [styles.panelAbierto, { paddingBottom: insets.bottom }]
          : { height: ALTURA_CERRADO + insets.bottom },
      ]}
    >
      {desplegado ? (
        <>
          <View style={styles.cabeceraAbierta}>
            <View style={styles.tituloGrupo}>
              <Text style={styles.titulo}>LOGS</Text>
              <Text style={styles.contador}>{entradas.length}</Text>
            </View>
            <View style={styles.acciones}>
              <Pressable
                onPress={limpiarLogs}
                style={styles.boton}
                accessibilityRole="button"
              >
                <Text style={styles.textoBoton}>Limpiar</Text>
              </Pressable>
              <Pressable
                onPress={() => setDesplegado(false)}
                style={styles.boton}
                accessibilityRole="button"
              >
                <Text style={styles.textoBoton}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            ref={listaRef}
            data={entradas}
            keyExtractor={(entrada) => entrada.id}
            renderItem={({ item }) => <LineaLog entrada={item} />}
            style={styles.lista}
            contentContainerStyle={styles.contenidoLista}
            onScroll={manejarScroll}
            onContentSizeChange={() => {
              if (seguirAlFinal.current) {
                listaRef.current?.scrollToEnd({ animated: false })
              }
            }}
            scrollEventThrottle={100}
            keyboardShouldPersistTaps="handled"
          />
        </>
      ) : (
        <Pressable
          onPress={mostrarPanel}
          style={styles.franjaCerrada}
          accessibilityRole="button"
          accessibilityLabel="Mostrar panel de logs"
        >
          <Text style={styles.titulo}>LOGS</Text>
          <Text style={styles.contador}>{entradas.length}</Text>
          <Text style={styles.ultimaLinea} numberOfLines={1}>
            {ultimaEntrada
              ? `${ultimaEntrada.hora ? `${ultimaEntrada.hora}  ` : ''}${ultimaEntrada.texto}`
              : 'Sin entradas'}
          </Text>
        </Pressable>
      )}
    </View>
  )
}

function LineaLog({ entrada }: { entrada: LogEntry }) {
  if (entrada.hora === '') {
    return (
      <Text style={styles.marcaSesion} numberOfLines={2}>
        {entrada.texto}
      </Text>
    )
  }

  return (
    <View style={styles.linea}>
      <Text style={styles.hora}>{entrada.hora}</Text>
      <Text style={[styles.textoLog, { color: colorDelLog(entrada.texto) }]}>
        {entrada.texto}
      </Text>
    </View>
  )
}

const fuenteMono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
})

const styles = StyleSheet.create({
  panel: {
    flexShrink: 0,
    overflow: 'hidden',
    backgroundColor: colores.fondo,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
  },
  panelAbierto: {
    height: '40%',
  },
  franjaCerrada: {
    height: ALTURA_CERRADO,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  tituloGrupo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 12,
    letterSpacing: 0.8,
  },
  contador: {
    color: colores.textoSuave,
    fontFamily: fuenteMono,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  ultimaLinea: {
    flex: 1,
    color: colores.textoSuave,
    fontFamily: fuenteMono,
    fontSize: 12,
  },
  cabeceraAbierta: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boton: {
    minWidth: 64,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  textoBoton: {
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 12,
  },
  lista: {
    flex: 1,
  },
  contenidoLista: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
  linea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3,
    gap: 10,
  },
  hora: {
    color: colores.textoSuave,
    fontFamily: fuenteMono,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  textoLog: {
    flex: 1,
    color: colores.texto,
    fontFamily: fuenteMono,
    fontSize: 12,
    lineHeight: 18,
  },
  marcaSesion: {
    paddingVertical: 7,
    color: colores.textoSuave,
    fontFamily: fuenteMono,
    fontSize: 12,
    textAlign: 'center',
  },
})

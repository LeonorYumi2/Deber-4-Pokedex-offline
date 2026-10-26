import { useMutationState } from '@tanstack/react-query'
import { StyleSheet, Text, View } from 'react-native'
import { mutationKeys } from '../api/queryKeys'
import { useOnline } from '../hooks/useOnline'
import { colores } from '../constants/theme'
import { fuentes } from './FontGate'

export function NetworkStatus() {
  const enLinea = useOnline()
  const cambiosPendientes = useMutationState({
    filters: { mutationKey: mutationKeys.crearFavorito.slice(0, 1), status: 'pending' },
    select: (mutacion) => mutacion.mutationId,
  }).length
  const estadoColor = enLinea ? colores.online : colores.offline

  return (
    <View style={styles.contenedor} accessibilityLiveRegion="polite">
      <View style={styles.estado}>
        <View style={[styles.punto, { backgroundColor: estadoColor }]} />
        <Text style={styles.textoEstado}>
          {enLinea ? 'Con conexión' : 'Sin conexión'}
        </Text>
      </View>
      {cambiosPendientes > 0 ? (
        <Text style={styles.pendientes}>
          {enLinea
            ? `${cambiosPendientes} cambios pendientes`
            : `${cambiosPendientes} cambios se enviarán al reconectar`}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    minHeight: 38,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  estado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textoEstado: {
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 12,
  },
  pendientes: {
    flex: 1,
    color: colores.pendiente,
    fontFamily: fuentes.regular,
    fontSize: 11,
    textAlign: 'right',
  },
})

import { StyleSheet, Text, View } from 'react-native'
import { colores } from '../constants/theme'
import { fuentes } from './FontGate'
import { NetworkStatus } from './NetworkStatus'

export function ScreenHeader({
  titulo,
  descripcion,
}: {
  titulo: string
  descripcion: string
}) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.titulos}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
      </View>
      <NetworkStatus />
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    paddingTop: 12,
  },
  titulos: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  titulo: {
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 28,
    letterSpacing: -0.8,
  },
  descripcion: {
    marginTop: 2,
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 14,
  },
})

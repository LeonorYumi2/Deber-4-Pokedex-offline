import type { ReactNode } from 'react'
import { useFonts } from 'expo-font'
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import { StyleSheet, Text, View } from 'react-native'
import { colores } from '../constants/theme'

export const fuentes = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',
} as const

export function FontGate({ children }: { children: ReactNode }) {
  const [cargada, error] = useFonts({
    [fuentes.regular]: SpaceGrotesk_400Regular,
    [fuentes.medium]: SpaceGrotesk_500Medium,
    [fuentes.bold]: SpaceGrotesk_700Bold,
  })

  if (error) {
    throw error
  }

  if (!cargada) {
    return (
      <View style={styles.cargando}>
        <Text style={styles.texto}>Preparando la Pokédex...</Text>
      </View>
    )
  }

  return children
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.fondo,
  },
  texto: {
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 16,
  },
})

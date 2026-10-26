import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { PokemonResumen } from '../types/pokemon'
import { colores } from '../constants/theme'
import { fuentes } from './FontGate'

export function PokemonRow({
  pokemon,
  favorito,
}: {
  pokemon: PokemonResumen
  favorito?: { pendiente?: boolean }
}) {
  return (
    <Link
      href={{ pathname: '/pokemon/[id]', params: { id: String(pokemon.id) } }}
      asChild
    >
      <Pressable style={({ pressed }) => [styles.fila, pressed && styles.presionada]}>
        <View style={styles.spriteContenedor}>
          <Image
            source={{ uri: pokemon.sprite }}
            style={styles.sprite}
            contentFit="contain"
            cachePolicy="memory-disk"
            accessibilityLabel={`Sprite de ${pokemon.nombre}`}
          />
        </View>
        <Text style={styles.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.nombre} numberOfLines={1}>
          {pokemon.nombre.charAt(0).toLocaleUpperCase() + pokemon.nombre.slice(1)}
        </Text>
        {favorito ? (
          <Text
            style={[
              styles.estrella,
              favorito.pendiente && styles.estrellaPendiente,
            ]}
            accessibilityLabel={
              favorito.pendiente ? 'Favorito pendiente' : 'Favorito'
            }
          >
            ★
          </Text>
        ) : (
          <View style={styles.espacioEstrella} />
        )}
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  fila: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
    backgroundColor: colores.fondo,
  },
  presionada: {
    backgroundColor: colores.superficie,
  },
  spriteContenedor: {
    width: 52,
    height: 52,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: colores.superficie,
  },
  sprite: {
    width: 48,
    height: 48,
  },
  numero: {
    width: 42,
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  nombre: {
    flex: 1,
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 16,
  },
  estrella: {
    width: 28,
    color: colores.texto,
    fontSize: 22,
    textAlign: 'right',
  },
  estrellaPendiente: {
    color: colores.pendiente,
  },
  espacioEstrella: {
    width: 28,
  },
})

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
      <Pressable
        style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
      >
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
            accessible
            accessibilityLabel={
              favorito.pendiente ? 'Favorito pendiente' : 'Favorito'
            }
          >
            ★
          </Text>
        ) : null}
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '48%',
    minHeight: 164,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.borde,
    borderRadius: 16,
    backgroundColor: colores.superficie,
  },
  presionada: {
    opacity: 0.82,
  },
  spriteContenedor: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: colores.fondo,
  },
  sprite: {
    width: 82,
    height: 82,
  },
  numero: {
    marginTop: 6,
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  nombre: {
    maxWidth: '100%',
    marginTop: 2,
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 15,
    textAlign: 'center',
  },
  estrella: {
    position: 'absolute',
    top: 8,
    right: 10,
    color: colores.texto,
    fontSize: 20,
  },
  estrellaPendiente: {
    color: colores.pendiente,
  },
})

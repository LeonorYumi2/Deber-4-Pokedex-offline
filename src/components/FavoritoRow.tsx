import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colorDeTipo, colores } from '../constants/theme'
import { usePokemonDetalle } from '../hooks/usePokemon'
import type { Favorito } from '../types/favorito'
import { fuentes } from './FontGate'

export function FavoritoRow({ favorito }: { favorito: Favorito }) {
  const { data: pokemon } = usePokemonDetalle(favorito.pokemonId)
  const colorTipo = colorDeTipo(pokemon?.tipos[0])

  return (
    <Link
      href={{
        pathname: '/pokemon/[id]',
        params: { id: String(favorito.pokemonId) },
      }}
      asChild
    >
      <Pressable
        style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
      >
        <View style={[styles.franja, { backgroundColor: colorTipo }]} />
        <View style={styles.spriteContenedor}>
          <Image
            source={{ uri: favorito.sprite }}
            style={styles.sprite}
            contentFit="contain"
            cachePolicy="memory-disk"
            accessibilityLabel={`Sprite de ${favorito.nombre}`}
          />
        </View>
        {favorito.pendiente ? (
          <Text style={styles.etiqueta}>Pendiente</Text>
        ) : null}
        <Text style={styles.nombre} numberOfLines={1}>
          {favorito.nombre.charAt(0).toLocaleUpperCase() +
            favorito.nombre.slice(1)}
        </Text>
        <Text style={styles.nota} numberOfLines={2}>
          {favorito.nota || 'Sin nota'}
        </Text>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '48%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: colores.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.borde,
    borderRadius: 16,
    overflow: 'hidden',
  },
  presionada: {
    opacity: 0.86,
  },
  franja: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  spriteContenedor: {
    width: 88,
    height: 88,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: colores.fondo,
  },
  sprite: {
    width: 82,
    height: 82,
  },
  nombre: {
    maxWidth: '100%',
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 15,
    textAlign: 'center',
  },
  nota: {
    alignSelf: 'stretch',
    marginTop: 5,
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  etiqueta: {
    position: 'absolute',
    top: 9,
    right: 10,
    color: colores.pendiente,
    fontFamily: fuentes.medium,
    fontSize: 10,
  },
})

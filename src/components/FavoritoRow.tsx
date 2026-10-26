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
      <Pressable style={({ pressed }) => [styles.fila, pressed && styles.presionada]}>
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
        <View style={styles.contenido}>
          <View style={styles.tituloFila}>
            <Text style={styles.nombre} numberOfLines={1}>
              {favorito.nombre.charAt(0).toLocaleUpperCase() +
                favorito.nombre.slice(1)}
            </Text>
            {favorito.pendiente ? (
              <Text style={styles.etiqueta}>Pendiente</Text>
            ) : null}
          </View>
          <Text style={styles.nota} numberOfLines={2}>
            {favorito.nota || 'Sin nota'}
          </Text>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  fila: {
    minHeight: 94,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colores.borde,
    borderRadius: 16,
    overflow: 'hidden',
  },
  presionada: {
    opacity: 0.82,
  },
  franja: {
    width: 4,
    alignSelf: 'stretch',
  },
  spriteContenedor: {
    width: 58,
    height: 58,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: colores.fondo,
  },
  sprite: {
    width: 52,
    height: 52,
  },
  contenido: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 14,
    gap: 4,
  },
  tituloFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombre: {
    flexShrink: 1,
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 16,
  },
  nota: {
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  etiqueta: {
    color: colores.pendiente,
    fontFamily: fuentes.medium,
    fontSize: 10,
  },
})

import { useMemo } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFavoritosLista } from '../../hooks/useFavoritos'
import { usePokemonLista } from '../../hooks/usePokemon'
import { colores } from '../../constants/theme'
import { FontGate, fuentes } from '../../components/FontGate'
import { PokemonRow } from '../../components/PokemonRow'
import { ScreenHeader } from '../../components/ScreenHeader'

export default function CatalogoScreen() {
  const consultaPokemon = usePokemonLista()
  const { data: favoritos = [] } = useFavoritosLista()
  const favoritosPorId = useMemo(
    () => new Map(favoritos.map((favorito) => [favorito.pokemonId, favorito])),
    [favoritos],
  )

  return (
    <FontGate>
      <SafeAreaView style={styles.pantalla} edges={['top', 'left', 'right']}>
        <ScreenHeader
          titulo="Pokédex"
          descripcion="Primera generación · 151 Pokémon"
        />
        {consultaPokemon.isPending ? (
          <View style={styles.estado}>
            <ActivityIndicator color={colores.textoSuave} />
            <Text style={styles.textoEstado}>Cargando catálogo...</Text>
          </View>
        ) : consultaPokemon.isError && !consultaPokemon.data ? (
          <View style={styles.estado}>
            <Text style={styles.textoError}>No se pudo cargar el catálogo.</Text>
            <Pressable
              style={styles.botonReintentar}
              onPress={() => void consultaPokemon.refetch()}
              accessibilityRole="button"
            >
              <Text style={styles.textoBoton}>Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            key="pokemon-grid-2"
            data={consultaPokemon.data ?? []}
            keyExtractor={(pokemon) => String(pokemon.id)}
            renderItem={({ item }) => (
              <PokemonRow
                pokemon={item}
                favorito={favoritosPorId.get(item.id)}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.filaCuadricula}
            contentContainerStyle={styles.lista}
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={9}
          />
        )}
      </SafeAreaView>
    </FontGate>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  filaCuadricula: {
    justifyContent: 'space-around',
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
  },
  textoEstado: {
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 14,
  },
  textoError: {
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 16,
    textAlign: 'center',
  },
  botonReintentar: {
    minHeight: 44,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    backgroundColor: colores.superficie,
  },
  textoBoton: {
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 14,
  },
})

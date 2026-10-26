import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FavoritoRow } from "../../components/FavoritoRow";
import { FontGate, fuentes } from "../../components/FontGate";
import { ScreenHeader } from "../../components/ScreenHeader";
import { colores } from "../../constants/theme";
import { useFavoritosLista } from "../../hooks/useFavoritos";

export default function FavoritosScreen() {
  const {
    data: favoritos = [],
    isPending,
    isError,
    refetch,
  } = useFavoritosLista();

  return (
    <FontGate>
      <SafeAreaView style={styles.pantalla} edges={["top", "left", "right"]}>
        <ScreenHeader
          titulo="Favoritos"
          descripcion="Tu equipo, con sus propias notas"
        />
        {isPending ? (
          <View style={styles.estado}>
            <Text style={styles.textoSecundario}>Cargando favoritos...</Text>
          </View>
        ) : isError && favoritos.length === 0 ? (
          <View style={styles.estado}>
            <Text style={styles.tituloVacio}>
              No se pudieron cargar los favoritos.
            </Text>
            <Pressable
              style={styles.botonCatalogo}
              onPress={() => void refetch()}
              accessibilityRole="button"
            >
              <Text style={styles.textoBoton}>Reintentar</Text>
            </Pressable>
          </View>
        ) : favoritos.length === 0 ? (
          <View style={styles.estado}>
            <Text style={styles.tituloVacio}>Todavía no hay favoritos</Text>
            <Text style={styles.textoSecundario}>
              Guarda un Pokémon para encontrarlo aquí junto con tu nota.
            </Text>
            <Link href="/(tabs)" asChild>
              <Pressable
                style={styles.botonCatalogo}
                accessibilityRole="button"
              >
                <Text style={styles.textoBoton}>Explorar catálogo</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <FlatList
            key="favorites-grid-2"
            data={favoritos}
            keyExtractor={(favorito) => favorito.id}
            renderItem={({ item }) => <FavoritoRow favorito={item} />}
            numColumns={2}
            columnWrapperStyle={styles.filaCuadricula}
            contentContainerStyle={styles.lista}
          />
        )}
      </SafeAreaView>
    </FontGate>
  );
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 12,
  },
  tituloVacio: {
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 20,
    textAlign: "center",
  },
  textoSecundario: {
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  botonCatalogo: {
    minHeight: 48,
    marginTop: 8,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 14,
    backgroundColor: colores.superficie,
  },
  textoBoton: {
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 14,
  },
});

import { Image } from 'expo-image'
import { useLocalSearchParams, router } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colorDeTipo, colores } from '../../constants/theme'
import { FontGate, fuentes } from '../../components/FontGate'
import { useCrearFavorito, useEditarFavorito, useFavoritosLista } from '../../hooks/useFavoritos'
import { usePokemonDetalle } from '../../hooks/usePokemon'
import type { PokemonDetalle } from '../../types/pokemon'

export default function PokemonDetalleScreen() {
  const parametros = useLocalSearchParams<{ id: string }>()
  const id = Number(Array.isArray(parametros.id) ? parametros.id[0] : parametros.id)
  const idValido = Number.isInteger(id) && id > 0
  const detalle = usePokemonDetalle(idValido ? id : 1)
  const favoritosQuery = useFavoritosLista()
  const favoritos = favoritosQuery.data ?? []
  const crearFavorito = useCrearFavorito()
  const editarFavorito = useEditarFavorito()
  const favorito = favoritos.find((item) => item.pokemonId === id)
  const [borradorNota, setBorradorNota] = useState<{
    favoritoId: string | null
    valor: string
  } | null>(null)
  const nota =
    borradorNota?.favoritoId === (favorito?.id ?? null)
      ? borradorNota.valor
      : favorito?.nota ?? ''
  const tipoColor = colorDeTipo(detalle.data?.tipos[0])

  const errorMutacion = crearFavorito.error ?? editarFavorito.error
  const guardando = crearFavorito.isPending || editarFavorito.isPending
  const maximoStat = 255

  const titulo = useMemo(
    () =>
      detalle.data
        ? detalle.data.nombre.charAt(0).toLocaleUpperCase() +
          detalle.data.nombre.slice(1)
        : '',
    [detalle.data],
  )

  if (!idValido) {
    return (
      <FontGate>
        <ErrorDetalle mensaje="El identificador del Pokémon no es válido." />
      </FontGate>
    )
  }

  if (detalle.isPending) {
    return (
      <FontGate>
        <CargandoDetalle />
      </FontGate>
    )
  }

  if (!detalle.data) {
    return (
      <FontGate>
        <ErrorDetalle
          mensaje="No se pudo cargar este Pokémon."
          onReintentar={() => void detalle.refetch()}
        />
      </FontGate>
    )
  }

  const pokemon = detalle.data
  const crear = () => {
    crearFavorito.mutate({
      pokemonId: pokemon.id,
      nombre: pokemon.nombre,
      sprite: pokemon.sprite,
      nota,
      creadoEn: new Date().toISOString(),
    })
  }
  const guardar = () => {
    if (!favorito) return
    editarFavorito.mutate({
      id: favorito.id,
      data: {
        pokemonId: favorito.pokemonId,
        nombre: favorito.nombre,
        sprite: favorito.sprite,
        nota,
        creadoEn: favorito.creadoEn,
      },
    })
  }

  return (
    <FontGate>
      <SafeAreaView style={styles.pantalla} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.contenido}>
          <Pressable
            onPress={() => router.back()}
            style={styles.botonAtras}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={styles.flecha}>‹</Text>
            <Text style={styles.textoAtras}>Volver</Text>
          </Pressable>

          <View style={[styles.hero, { borderColor: tipoColor }]}>
            <View style={[styles.circulo, { backgroundColor: tipoColor }]}>
              <Image
                source={{ uri: pokemon.imagen }}
                style={styles.imagen}
                contentFit="contain"
                cachePolicy="memory-disk"
                accessibilityLabel={`Imagen de ${titulo}`}
              />
            </View>
            <Text style={styles.numero}>#{String(pokemon.id).padStart(3, '0')}</Text>
            <Text style={styles.nombre}>{titulo}</Text>
            <View style={styles.tipos}>
              {pokemon.tipos.map((tipo) => (
                <View
                  key={tipo}
                  style={[styles.chipTipo, { borderColor: tipoColor }]}
                >
                  <View style={[styles.puntoTipo, { backgroundColor: tipoColor }]} />
                  <Text style={styles.textoTipo}>{tipo}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.medidas}>
            <Medida titulo="Altura" valor={`${(pokemon.altura / 10).toFixed(1)} m`} />
            <View style={styles.divisorMedida} />
            <Medida titulo="Peso" valor={`${(pokemon.peso / 10).toFixed(1)} kg`} />
          </View>

          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Estadísticas</Text>
            {pokemon.stats.map((stat) => (
              <StatBar
                key={stat.nombre}
                stat={stat}
                maximo={maximoStat}
                color={tipoColor}
              />
            ))}
          </View>

          <View style={styles.seccionFavorito}>
            <Text style={styles.tituloSeccion}>
              {favorito ? 'Tu nota' : 'Guardar en favoritos'}
            </Text>
            {favoritosQuery.isPending ? (
              <Text style={styles.textoEstado}>Consultando tus favoritos...</Text>
            ) : favoritosQuery.isError && !favoritosQuery.data ? (
              <View style={styles.errorFavoritos}>
                <Text style={styles.errorMutacion}>
                  No se pudieron consultar tus favoritos.
                </Text>
                <Pressable
                  onPress={() => void favoritosQuery.refetch()}
                  style={styles.botonReintentar}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoBoton}>Reintentar</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <TextInput
                  value={nota}
                  onChangeText={(valor) =>
                    setBorradorNota({ favoritoId: favorito?.id ?? null, valor })
                  }
                  placeholder="Escribe una nota para este Pokémon..."
                  placeholderTextColor={colores.textoSuave}
                  multiline
                  maxLength={240}
                  textAlignVertical="top"
                  style={styles.campoNota}
                  accessibilityLabel="Nota de favorito"
                />
                {favorito?.pendiente ? (
                  <Text style={styles.etiquetaPendiente}>Pendiente de envío</Text>
                ) : null}
                {errorMutacion ? (
                  <Text style={styles.errorMutacion}>
                    No se pudo guardar: {errorMutacion.message}
                  </Text>
                ) : null}
                <Pressable
                  style={[
                    styles.botonGuardar,
                    { borderColor: tipoColor },
                    (guardando || favorito?.pendiente) && styles.botonDeshabilitado,
                  ]}
                  disabled={guardando || Boolean(favorito?.pendiente)}
                  onPress={favorito ? guardar : crear}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoBoton}>
                    {guardando
                      ? 'Guardando...'
                      : favorito
                        ? 'Guardar nota'
                        : 'Agregar a favoritos'}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </FontGate>
  )
}

function Medida({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View style={styles.medida}>
      <Text style={styles.etiquetaMedida}>{titulo}</Text>
      <Text style={styles.valorMedida}>{valor}</Text>
    </View>
  )
}

function StatBar({
  stat,
  maximo,
  color,
}: {
  stat: PokemonDetalle['stats'][number]
  maximo: number
  color: string
}) {
  const porcentaje = Math.min((stat.valor / maximo) * 100, 100)
  const nombres: Record<string, string> = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque esp.',
    'special-defense': 'Defensa esp.',
    speed: 'Velocidad',
  }

  return (
    <View style={styles.statFila}>
      <Text style={styles.nombreStat}>{nombres[stat.nombre] ?? stat.nombre}</Text>
      <View style={styles.fondoStat}>
        <View
          style={[
            styles.rellenoStat,
            { width: `${porcentaje}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.valorStat}>{stat.valor}</Text>
    </View>
  )
}

function CargandoDetalle() {
  return (
    <SafeAreaView style={styles.pantalla} edges={['top', 'left', 'right']}>
      <View style={styles.estado}>
        <View style={styles.esqueletoImagen} />
        <View style={styles.esqueletoTitulo} />
        <ActivityIndicator color={colores.textoSuave} />
        <Text style={styles.textoEstado}>Cargando Pokémon...</Text>
      </View>
    </SafeAreaView>
  )
}

function ErrorDetalle({
  mensaje,
  onReintentar,
}: {
  mensaje: string
  onReintentar?: () => void
}) {
  return (
    <SafeAreaView style={[styles.pantalla, styles.estado]} edges={['top', 'bottom']}>
      <Text style={styles.textoError}>{mensaje}</Text>
      {onReintentar ? (
        <Pressable
          style={styles.botonReintentar}
          onPress={onReintentar}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  botonAtras: {
    minHeight: 48,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    gap: 6,
  },
  flecha: {
    color: colores.texto,
    fontFamily: fuentes.regular,
    fontSize: 32,
    lineHeight: 34,
  },
  textoAtras: {
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 14,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 22,
    borderBottomWidth: 1,
  },
  circulo: {
    width: 204,
    height: 204,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 102,
  },
  imagen: {
    width: 190,
    height: 190,
  },
  numero: {
    marginTop: 14,
    color: colores.textoSuave,
    fontFamily: fuentes.medium,
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  nombre: {
    marginTop: 2,
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 34,
    letterSpacing: -1,
    textAlign: 'center',
  },
  tipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  chipTipo: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    gap: 7,
    borderWidth: 1,
    borderRadius: 18,
    backgroundColor: colores.superficie,
  },
  puntoTipo: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  textoTipo: {
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  medidas: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 16,
    backgroundColor: colores.superficie,
  },
  medida: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  etiquetaMedida: {
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 12,
  },
  valorMedida: {
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 18,
  },
  divisorMedida: {
    width: StyleSheet.hairlineWidth,
    height: 42,
    backgroundColor: colores.borde,
  },
  seccion: {
    marginTop: 26,
  },
  tituloSeccion: {
    marginBottom: 14,
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 18,
  },
  statFila: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nombreStat: {
    width: 94,
    color: colores.textoSuave,
    fontFamily: fuentes.regular,
    fontSize: 12,
  },
  fondoStat: {
    flex: 1,
    height: 7,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: colores.superficieAlta,
  },
  rellenoStat: {
    height: '100%',
    borderRadius: 4,
  },
  valorStat: {
    width: 32,
    color: colores.texto,
    fontFamily: fuentes.medium,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  seccionFavorito: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  campoNota: {
    minHeight: 96,
    padding: 14,
    color: colores.texto,
    fontFamily: fuentes.regular,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 14,
    backgroundColor: colores.superficie,
  },
  etiquetaPendiente: {
    marginTop: 10,
    color: colores.pendiente,
    fontFamily: fuentes.medium,
    fontSize: 13,
  },
  errorMutacion: {
    marginTop: 10,
    color: colores.offline,
    fontFamily: fuentes.regular,
    fontSize: 13,
  },
  errorFavoritos: {
    alignItems: 'flex-start',
    gap: 12,
  },
  botonGuardar: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: colores.superficie,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: colores.texto,
    fontFamily: fuentes.bold,
    fontSize: 14,
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  esqueletoImagen: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colores.superficieAlta,
  },
  esqueletoTitulo: {
    width: 170,
    height: 24,
    borderRadius: 12,
    backgroundColor: colores.superficieAlta,
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
    minHeight: 46,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 12,
    backgroundColor: colores.superficie,
  },
})

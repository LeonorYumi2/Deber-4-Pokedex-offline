# Pokédex Offline

Aplicación móvil hecha con **React Native y Expo** que muestra los 151 Pokémon de la primera generación y permite guardar **favoritos con una nota personal**. El catálogo se consume de **PokeAPI** (solo lectura) y los favoritos se guardan en **MockAPI**. Está pensada para **funcionar sin conexión**: los datos se leen desde una caché guardada en el dispositivo y los cambios hechos sin internet se envían solos al volver la red.

## Funcionalidades

- **Catálogo** de 151 Pokémon con su sprite y una ★ en los que ya son favoritos.
- **Detalle** de cada Pokémon: tipo, altura, peso y estadísticas, con el color del tipo.
- **Favoritos con nota:** agregar un Pokémon al equipo y editar su nota (crear y editar en MockAPI).
- **Caché persistida:** al abrir la app, los datos aparecen al instante desde el disco.
- **Modo sin conexión:** los cambios sin red quedan *pendientes* y se envían al reconectar, incluso si se cierra la app.
- **Indicador de red y panel de logs con hora** dentro de la app, para ver qué ocurre en cada momento.

## Capturas

| Catálogo | Detalle | Favoritos | Sin conexión (logs) |
|:---:|:---:|:---:|:---:|
| <img width="1000" height="1600" alt="image" src="https://github.com/user-attachments/assets/c9aec7fc-03ae-4336-9399-badb4cfed6a7" /> | <img width="1000" height="1600" alt="image" src="https://github.com/user-attachments/assets/7a600f66-35ae-4fd2-a127-66e2527768c4" /> | <img width="1000" height="1600" alt="image" src="https://github.com/user-attachments/assets/338491f4-b525-4bb2-9cb0-d683630e4779" /> | <img width="1000" height="1600" alt="image" src="https://github.com/user-attachments/assets/959b07ad-e112-42e1-a40e-f4f2566f0e91" />|

## Tecnologías

Expo SDK 57 y Expo Router (navegación por archivos) · **TanStack Query v5** (consultas, mutaciones y caché) · `query-async-storage-persister` + AsyncStorage (persistencia) · `expo-network` (estado de la red) · axios (HTTP) · `expo-image` (caché de imágenes) · TypeScript.

## Estructura

```
src/
├── api/
│   ├── queryKeys.ts          Claves de consulta y de mutación
│   ├── cache.ts              QueryClient, tiempos de caché y persister
│   ├── mutations.ts          Mutaciones de crear y editar (setMutationDefaults)
│   ├── online.ts             onlineManager conectado a expo-network
│   ├── clients.ts            Clientes axios (PokeAPI y MockAPI)
│   ├── pokemon.service.ts    Llamadas a PokeAPI
│   └── favoritos.service.ts  Llamadas a MockAPI
├── app/                      Pantallas (Expo Router)
│   ├── (tabs)/               Pestañas: Catálogo y Favoritos
│   └── pokemon/[id].tsx      Detalle de un Pokémon
├── components/               PokemonRow, FavoritoRow, NetworkStatus, LogPanel...
├── hooks/                    usePokemon, useFavoritos, useOnline
├── types/                    Tipos de TypeScript
├── utils/log.ts              Logs con hora, guardados en disco
└── constants/theme.ts        Colores y tema
```

Los **servicios** solo hablan con la API; los **hooks** envuelven TanStack Query; las **pantallas** solo muestran datos. Así la lógica de caché y de conexión está separada de la interfaz.

## Cómo ejecutarlo

**Requisitos:** Node.js, un emulador Android o un teléfono, y una cuenta gratuita en [MockAPI](https://mockapi.io).

1. En MockAPI crea un recurso `favoritos` con los campos `pokemonId` (Number) y `nombre`, `sprite`, `nota`, `creadoEn` (String). Déjalo vacío (`[]`).
2. Instala y configura:
   ```bash
   npm install
   cp .env.example .env
   ```
   Edita `.env` con tu URL de MockAPI (termina en `/`):
   ```
   EXPO_PUBLIC_POKEAPI_URL=https://pokeapi.co/api/v2/
   EXPO_PUBLIC_MOCKAPI_URL=https://TU_ID.mockapi.io/
   ```
3. Inicia la app:
   ```bash
   npx expo start
   ```
4. **APK:** `npx eas-cli@latest build -p android --profile preview`. Como el `.env` no se sube a git, las dos variables se guardan en EAS con `eas env:create`.

> Para probar el modo sin conexión hay que usar el APK: Expo Go necesita red para recargar el código.

---

## Cómo funciona

### Claves de consulta (`queryKeys.ts`)
Son jerárquicas: una clave coincide con todas las que empiezan igual.

| Clave | Representa |
|---|---|
| `['pokemon', 'lista']` | Catálogo de 151 |
| `['pokemon', 'detalle', id]` | Detalle de un Pokémon |
| `['favoritos', 'lista']` | Favoritos (MockAPI) |

### Mutaciones e invalidación

| Mutación | `mutationKey` | Invalida |
|---|---|---|
| Crear favorito (POST) | `['favoritos', 'crear']` | `['favoritos']` |
| Editar nota (PUT) | `['favoritos', 'editar']` | `['favoritos']` |

Ambas solo cambian datos propios, por eso se invalida `['favoritos']` (cubre la lista). **No** se invalida `['pokemon']`: PokeAPI es de solo lectura y refrescarla causaría peticiones inútiles. Se invalida en `onSettled`: si la mutación falla, se revierte el cambio y la lista se vuelve a pedir.

### `staleTime` y `gcTime`

| | `staleTime` | `gcTime` | Por qué |
|---|---|---|---|
| **PokeAPI** | 1 día | 14 días | Casi nunca cambia. |
| **MockAPI** | 30 s | 7 días | El usuario la modifica; debe refrescarse. |
| **`maxAge` del persister** | | 7 días | La app abre con datos aunque pasen días sin red. |

Se cumple `gcTime ≥ maxAge` en ambos casos. **Si `gcTime` fuera menor** (p. ej. los 5 minutos por defecto), la caché se borraría de memoria aunque la copia del disco siguiera vigente, y como el persister guarda el estado *actual*, también se borraría del disco: la app abriría vacía y, sin red, sin datos.

### Persistencia y modo sin conexión
- **Persistencia:** `PersistQueryClientProvider` guarda la caché en AsyncStorage y la restaura al abrir, antes de mostrar nada.
- **`onlineManager` + `expo-network`:** avisan de los cambios de red. Sin conexión, las mutaciones quedan **pausadas** en lugar de fallar.
- **`setMutationDefaults`:** una función no se puede guardar en disco. Al reabrir, la mutación pausada solo conserva su `mutationKey`; aquí se registra qué función le corresponde.
- **`resumePausedMutations()`** en el `onSuccess` del provider: al terminar de restaurar la caché, reenvía lo pendiente (y reintenta si el fallo es de red).
- **Pendientes en pantalla:** actualización optimista con etiqueta "pendiente". Un favorito creado sin red usa un id temporal y no se edita hasta confirmarse.

### Logs
El panel de logs muestra los eventos con hora y conserva los de la sesión anterior. Al reabrir con un cambio pendiente se ve, por ejemplo:

```
Caché restaurada desde disco → 151 pokémon, 9 favoritos, 1 mutación(es) pausada(s)
PUT MockAPI → favorito 5
PUT confirmado por MockAPI → id 5
```

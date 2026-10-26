const POKEMON = ['pokemon'] as const
const FAVORITOS = ['favoritos'] as const

export const queryKeys = {
  pokemon: {
    all: POKEMON,
    lista: () => [...POKEMON, 'lista'] as const,
    detalle: (id: number) => [...POKEMON, 'detalle', id] as const,
  },
  favoritos: {
    all: FAVORITOS,
    lista: () => [...FAVORITOS, 'lista'] as const,
  },
}

// Las mutaciones también llevan clave: es lo que permite
// reconectarlas con su función tras cerrar la app
export const mutationKeys = {
  crearFavorito: ['favoritos', 'crear'] as const,
  editarFavorito: ['favoritos', 'editar'] as const,
}
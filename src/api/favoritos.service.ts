import { mockClient } from './clients'
import type { Favorito, FavoritoInput } from '../types/favorito'

export const favoritosService = {
  getAll: async (): Promise<Favorito[]> => {
    const { data } = await mockClient.get<Favorito[]>('favoritos')
    return data
  },

  add: async (favorito: FavoritoInput): Promise<Favorito> => {
    const { data } = await mockClient.post<Favorito>('favoritos', favorito)
    return data
  },

  update: async (id: string, favorito: FavoritoInput): Promise<Favorito> => {
    const { data } = await mockClient.put<Favorito>(`favoritos/${id}`, favorito)
    return data
  },
}
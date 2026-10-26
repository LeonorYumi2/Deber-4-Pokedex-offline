import axios from 'axios'

// Cliente para la API pública (solo lectura)
export const pokeClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_POKEAPI_URL,
})

// Cliente para MockAPI (nuestros datos)
export const mockClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOCKAPI_URL,
  headers: { 'Content-Type': 'application/json' },
})
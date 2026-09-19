import axios from 'axios'
import type { LinkBioPaginaPublica } from '../types/LinkBioTypes'

const LinkBioApiPath = {
  ConfiguracaoPublica: '/link-bio/publico',
  Clique: (linkId: string) => `/link-bio/publico/links/${linkId}/clique`,
} as const

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function obterConfiguracaoPublica(signal?: AbortSignal) {
  const response = await api.get<LinkBioPaginaPublica>(LinkBioApiPath.ConfiguracaoPublica, { signal })
  return response.data
}

export async function registrarClique(linkId: string) {
  await api.post(LinkBioApiPath.Clique(linkId))
}

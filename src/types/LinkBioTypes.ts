export interface LinkBioItem {
  id: string
  titulo: string
  url: string
  ordem: number
  icone?: string
}

export interface LinkBioPaginaPublica {
  nomeFantasia: string
  logo?: string
  titulo: string
  descricao?: string
  corDeFundo?: string
  corPrincipal?: string
  backgroundImage?: string
  links: LinkBioItem[]
}

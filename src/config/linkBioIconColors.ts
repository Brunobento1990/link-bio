const LinkBioIconColor = {
  Email: '#f97316',
  Facebook: '#1877f2',
  Instagram: '#e4405f',
  LinkExterno: '#8b5cf6',
  Localizacao: '#ea4335',
  Loja: '#f59e0b',
  Site: '#0ea5e9',
  Telefone: '#22c55e',
  WhatsApp: '#25d366',
  YouTube: '#ff0000',
} as const

const linkBioIconColors: Readonly<Record<string, string>> = {
  'mdi:email': LinkBioIconColor.Email,
  'mdi:facebook': LinkBioIconColor.Facebook,
  'mdi:instagram': LinkBioIconColor.Instagram,
  'mdi:link-variant': LinkBioIconColor.LinkExterno,
  'mdi:map-marker': LinkBioIconColor.Localizacao,
  'mdi:phone': LinkBioIconColor.Telefone,
  'mdi:shopping': LinkBioIconColor.Loja,
  'mdi:web': LinkBioIconColor.Site,
  'mdi:whatsapp': LinkBioIconColor.WhatsApp,
  'mdi:youtube': LinkBioIconColor.YouTube,
}

export function obterCorIconeLinkBio(icone: string) {
  return linkBioIconColors[icone] ?? 'currentColor'
}

import axios from 'axios'
import { useEffect, useState } from 'react'
import { obterConfiguracaoPublica } from '../api/linkBioApi'
import { obterCorIconeLinkBio } from '../config/linkBioIconColors'
import { useThemeApp } from '../hook/useThemeApp'
import type { LinkBioPaginaPublica } from '../types/LinkBioTypes'
import { AvatarApp } from './AvatarApp/AvatarApp'
import { BoxApp } from './BoxApp/BoxApp'
import {
  BoxAppAlignItems,
  BoxAppComponent,
  BoxAppDisplay,
  BoxAppFlexDirection,
  BoxAppJustifyContent,
  BoxAppTextAlign,
} from './BoxApp/boxAppTypes'
import { ButtonApp, ButtonAppSize } from './ButtonApp/ButtonApp'
import { IconApp } from './Icon/IconApp'
import { SkeletonApp } from './SkeletonApp/SkeletonApp'
import {
  TextApp,
  TextAppAlign,
  TextAppColor,
  TextAppSize,
  TextAppWeight,
} from './TextApp/TextApp'

const PageStatus = {
  Error: 'error',
  Loading: 'loading',
  Success: 'success',
} as const

type PageStatus = (typeof PageStatus)[keyof typeof PageStatus]

function formatarImagemBase64(imagem?: string) {
  if (!imagem || imagem.startsWith('data:') || imagem.startsWith('http')) return imagem
  return `data:image/png;base64,${imagem}`
}

function atualizarMetadados(configuracao: LinkBioPaginaPublica) {
  document.title = configuracao.nomeFantasia

  const logo = formatarImagemBase64(configuracao.logo)
  if (!logo) return

  let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.appendChild(favicon)
  }
  favicon.href = logo
}

function LinkBioContent({ configuracao }: { configuracao: LinkBioPaginaPublica }) {
  const {
    backgroundColor,
    borderRadius,
    colorWithOpacity,
    cores,
    getContrastText,
    shadow,
  } = useThemeApp()
  const links = [...configuracao.links].sort((a, b) => a.ordem - b.ordem)
  const fundo = configuracao.corDeFundo || backgroundColor.default
  const principal = configuracao.corPrincipal || cores.primary
  const texto = getContrastText(fundo)
  const sombraTexto = configuracao.backgroundImage
    ? `0 1px 4px ${colorWithOpacity(getContrastText(texto), 0.75)}`
    : undefined

  return (
    <BoxApp
      alignItems={BoxAppAlignItems.Center}
      backgroundColor={fundo}
      component={BoxAppComponent.Main}
      display={BoxAppDisplay.Flex}
      justifyContent={BoxAppJustifyContent.Center}
      minHeight="100dvh"
      px={2}
      py={5}
      sx={{
        backgroundImage: configuracao.backgroundImage
          ? `linear-gradient(rgb(0 0 0 / 18%), rgb(0 0 0 / 18%)), url(${configuracao.backgroundImage})`
          : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <BoxApp
        alignItems={BoxAppAlignItems.Center}
        display={BoxAppDisplay.Flex}
        flexDirection={BoxAppFlexDirection.Column}
        gap={1.5}
        maxWidth={600}
        width="100%"
      >
        <AvatarApp
          alt={`Logo de ${configuracao.nomeFantasia}`}
          src={formatarImagemBase64(configuracao.logo)}
          sx={{ bgcolor: principal, boxShadow: shadow, height: 88, width: 88 }}
        />
        <TextApp
          align={TextAppAlign.Center}
          color={texto}
          size={TextAppSize.Large}
          sx={{ textShadow: sombraTexto }}
          weight={TextAppWeight.Bold}
        >
          {configuracao.nomeFantasia}
        </TextApp>
        <TextApp
          align={TextAppAlign.Center}
          color={texto}
          fontSize="clamp(1.8rem, 6vw, 2.5rem)"
          sx={{ textShadow: sombraTexto }}
          weight={TextAppWeight.Bold}
        >
          {configuracao.titulo}
        </TextApp>
        {configuracao.descricao && (
          <TextApp
            align={TextAppAlign.Center}
            color={texto}
            fontSize="1rem"
            sx={{ textShadow: sombraTexto, whiteSpace: 'pre-line' }}
          >
            {configuracao.descricao}
          </TextApp>
        )}

        <BoxApp
          display={BoxAppDisplay.Flex}
          flexDirection={BoxAppFlexDirection.Column}
          gap={1.5}
          mt={2}
          width="100%"
        >
          {links.map((link) => (
            <ButtonApp
              fullWidth
              key={link.id}
              onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              size={ButtonAppSize.Large}
              startIcon={
                link.icone ? (
                  <IconApp
                    color={obterCorIconeLinkBio(link.icone)}
                    icon={link.icone}
                    width="1.35rem"
                  />
                ) : undefined
              }
              sx={{
                backgroundColor: principal,
                borderRadius,
                boxShadow: shadow,
                color: getContrastText(principal),
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                minHeight: 52,
                '&:hover': { backgroundColor: principal, filter: 'brightness(0.92)' },
              }}
            >
              {link.titulo}
            </ButtonApp>
          ))}
        </BoxApp>

        {links.length === 0 && (
          <TextApp
            align={TextAppAlign.Center}
            color={texto}
            sx={{ textShadow: sombraTexto }}
          >
            Nenhum link disponível.
          </TextApp>
        )}
      </BoxApp>
    </BoxApp>
  )
}

function FeedbackPage({ error = false }: { error?: boolean }) {
  return (
    <BoxApp
      alignItems={BoxAppAlignItems.Center}
      component={BoxAppComponent.Main}
      display={BoxAppDisplay.Flex}
      justifyContent={BoxAppJustifyContent.Center}
      minHeight="100dvh"
      p={3}
    >
      {error ? (
        <BoxApp textAlign={BoxAppTextAlign.Center}>
          <TextApp fontSize="1.5rem" weight={TextAppWeight.Bold}>
            Página indisponível
          </TextApp>
          <TextApp color={TextAppColor.Secondary} sx={{ mt: 1 }}>
            Não foi possível carregar esta página no momento.
          </TextApp>
        </BoxApp>
      ) : (
        <SkeletonApp height={560} variant="rounded" width="min(100%, 600px)" />
      )}
    </BoxApp>
  )
}

export function LinkBioPage() {
  const [configuracao, setConfiguracao] = useState<LinkBioPaginaPublica>()
  const [status, setStatus] = useState<PageStatus>(PageStatus.Loading)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarConfiguracao() {
      try {
        const response = await obterConfiguracaoPublica(controller.signal)
        atualizarMetadados(response)
        setConfiguracao(response)
        setStatus(PageStatus.Success)
      } catch (error) {
        if (axios.isCancel(error)) return
        setStatus(PageStatus.Error)
      }
    }

    void carregarConfiguracao()
    return () => controller.abort()
  }, [])

  if (status === PageStatus.Loading) return <FeedbackPage />
  if (status === PageStatus.Error || !configuracao) return <FeedbackPage error />

  return <LinkBioContent configuracao={configuracao} />
}

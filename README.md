# link-bio

Frontend público para exibir a configuração e os links da página LinkBio.

## Ambiente

Copie `.env.production.example` para o arquivo do ambiente desejado e configure `VITE_API_URL`.

## Comandos

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`

O frontend consulta `GET /link-bio/publico`. A resposta esperada segue `LinkBioPaginaPublica`, definida em `src/types/LinkBioTypes.ts`.

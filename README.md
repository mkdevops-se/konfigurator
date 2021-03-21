# `konfigurator` – Ordning och reda i OpenShift

En webbtjänst för att spåra och rekonfigurera vad som körs i dina OpenShift-miljöer.

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/mkdevops-se/konfigurator) [![Docker Repository on Quay](https://quay.io/repository/mkdevops/konfigurator/status "Docker Repository on Quay")](https://quay.io/repository/mkdevops/konfigurator)

## Ramverk


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Installera beroenden

```bash
$ npm install
```

## Starta applikationen

```bash
# create development env and start in watch mode
$ cp -v .env.template .env.development
$ NODE_ENV=development npm run start:dev

# create prod env and start in production mode
$ cp -v .env.template .env.production
$ NODE_ENV=production npm run start:prod
```

### Lokal demo-deployment

Starta applikationen, exportera den biljett/JWT som applikationen autogenerer, och kör sedan Bash-scriptet som
innehåller cURL-kommandon för setup av demo-miljön:

```bash
$ export ACCESS_TOKEN=$(cat ./tmp/access_token.txt)  # Default OAUTH2_LOCAL_ACCESS_TOKEN path.
$ bash scripts/setup-demo.sh
```

Därefter behöver applikationen startas om en första gång, sedan kan man gå vidare med att
öppna http://localhost:3000/ i Chrome och verifiera att man omdirigeras till en översiktssida som
visar fyra komplexa matriser med miljöinformation.

## Kör testerna

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Bygg och publicera

Installera [Source-to-Image (S2I)](https://github.com/openshift/source-to-image) och bygg senaste master-grenen:

```bash
$ s2i build https://github.com/mkdevops-se/konfigurator \
  quay.io/centos7/nodejs-12-centos7 quay.io/mkdevops/konfigurator
```

Publicera Docker-imagen:

```bash
docker push quay.io/mkdevops/konfigurator
```

## Starta via Docker Compose

För mer permanent bruk kan Konfigurator deployas som en Docker-container:

```bash
$ docker-compose up -d konfigurator
```

## Changelog

### `v0.3.0` – Grundläggande säkerhet med autentiseringskrav

- API-endpoints som tillhandahåller skriv-access begränsade till klienter med
  en giltig biljett i _`Authorization`_-headern eller en inloggad OpenID Connect-session med Auth0
- README-instruktionen för _Lokal demo-deployment_ uppdaterad med nytt förfarande
- Refaktorerad konfigurationshantering för utveckling och produktion

### `v0.2.0` – Inkrementella förbättringar

- `/health`-endpoint tillagd
- Översiktssida för kända byggen från OpenShift under `/builds`
- Översiktssida med Konfiguratorns historik av bakgrundsjobb under `/tasks`

### `v0.1.1` – Buggfixar för Docker-deployment

- S2I-stöd tillagt och dokumenterat tillsammans med publiceringssteg
- `package.json`-dependencies rättade för produktions-runtime
- Docker Compose-fil för enkel deployment på hq.mkdevops.se

### `v0.1.0` – Initial implementation

- Första version redo för integrering via OpenShift CI/CD pipeline och deployment i testkluster
- Fullt fungerande bakgrundsinläsning av mockad bygginfo för demo-deployments


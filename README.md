<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

---

## Descrição

Este projeto foi desenvolvido como parte de um **teste técnico para uma vaga de desenvolvedor backend** com foco em NestJS, Docker e MySQL.

Ele simula um sistema de gestão de **fretes**, incluindo:

- Cadastro de empresas
- Criação e controle de fretes realizados
- Relatórios mensais com detalhes por empresa
- Acompanhamento de valores e status de pagamento
- Cadastro de usuários com controle de permissões
- Acesso administrativo e controle de senhas

---

## Funcionalidades

- 🏢 Cadastro e gerenciamento de empresas
- 🚚 Cadastro e controle de fretes por empresa
- 📊 Relatórios detalhados mensais por empresa
- 💰 Acompanhamento de valores de frete e status de pagamento
- 🔐 Sistema de autenticação e controle de usuários
- 👨‍💻 Acesso administrativo com todas as permissões

---

## Tecnologias utilizadas

- [NestJS](https://nestjs.com/)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

## Instalação

```bash
# Instale as dependências
$ npm install
```

---

## Executando o projeto com Docker

```bash
# Suba os containers
$ docker-compose up -d

# Acesse o container da aplicação
$ docker exec -it nome_do_container bash

# Rode as migrations
$ npx prisma migrate dev
```

---

## Executando sem Docker

```bash
# Execute em modo desenvolvimento
$ npm run start:dev
```

Certifique-se de ter o MySQL rodando localmente e o `.env` configurado corretamente.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="sua_chave_secreta"
```

---

## Testes

```bash
# Testes unitários
$ npm run test

# Testes end-to-end
$ npm run test:e2e

# Cobertura de testes
$ npm run test:cov
```

---

## Endpoints principais

- `POST /auth/login` - Autenticação de usuário
- `POST /users` - Cadastro de usuário
- `POST /companies` - Cadastro de empresa
- `POST /freights` - Cadastro de frete
- `GET /reports/monthly` - Relatório mensal

---

## Licença

Nest é [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

## Autor do projeto

Desenvolvido como parte de teste técnico por Caio Belizario.

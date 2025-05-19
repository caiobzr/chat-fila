# Sistema de Filas para Chat

Sistema backend para gerenciamento de mensagens de chat com sistema de filas e priorização.

## Tecnologias Utilizadas

- Node.js com NestJS
- MySQL
- Docker
- JWT para autenticação
- Cache com Cache Manager
- Swagger para documentação da API

## Requisitos

- Node.js 16+
- Docker e Docker Compose
- MySQL 8+

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd chat-fila
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo .env com suas configurações.

4. Inicie o banco de dados com Docker:
```bash
docker-compose up -d
```

5. Execute as migrações (ou crie as colunas manualmente, se necessário):
```bash
npm run typeorm migration:run
```

6. Inicie o servidor:
```bash
npm run start:dev
```

## Documentação da API

A documentação da API está disponível em:
```
http://localhost:3000/api
```

## Estrutura do Projeto

```
src/
├── auth/                 # Autenticação e autorização
├── cliente/             # Gerenciamento de clientes
├── mensagem/            # Gerenciamento de mensagens
├── middleware/          # Middlewares da aplicação
├── status/             # WebSocket para status em tempo real
└── app.module.ts       # Módulo principal
```

## Funcionalidades

### Autenticação
- Login com email e senha
- JWT para autenticação
- Proteção de rotas

### Sistema de Filas
- Fila com priorização (Normal/Urgente)
- Processamento assíncrono
- Balanceamento de prioridades
- Tratamento de falhas e retry

### Cache
- Cache de estatísticas
- Cache de mensagens recentes
- Invalidação automática

### Monitoramento
- Logs estruturados
- Métricas de performance
- Status em tempo real via WebSocket

## Endpoints Principais

### Autenticação
- POST /auth/login - Login com email e senha

**Exemplo:**
```json
{
  "email": "teste@teste.com",
  "senha": "123456"
}
```
**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### Clientes
- POST /cliente - Criar cliente
- GET /cliente/:id - Obter cliente
- PUT /cliente/:id - Atualizar cliente

**Exemplo de criação:**
```json
{
  "nome": "Teste",
  "email": "teste@teste.com",
  "senha": "123456",
  "cpfCnpj": "12345678900"
}
```

### Mensagens
- POST /mensagem - Enviar mensagem
- GET /mensagem/pendentes - Listar mensagens pendentes
- GET /mensagem/processadas - Listar mensagens processadas
- GET /mensagem/estatisticas - Estatísticas da fila

**Headers obrigatórios para rotas protegidas:**
- `Authorization: Bearer SEU_TOKEN_AQUI`
- `x-cpf-cnpj: 12345678900`

**Exemplo de envio de mensagem:**
```json
{
  "conteudo": "Teste de mensagem",
  "prioridade": 1
}
```

## Como testar rapidamente

1. **Criar cliente:**
```bash
curl -X POST http://localhost:3000/cliente -H "Content-Type: application/json" -d '{"nome":"Teste","email":"teste@teste.com","senha":"123456","cpfCnpj":"12345678900"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"teste@teste.com","senha":"123456"}'
```

3. **Enviar mensagem:**
```bash
curl -X POST http://localhost:3000/mensagem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "x-cpf-cnpj: 12345678900" \
  -d '{"conteudo":"Teste de mensagem","prioridade":1}'
```

## Observações importantes
- Sempre envie o header `x-cpf-cnpj` nas rotas protegidas de mensagem.
- Use o token JWT retornado no login para acessar as rotas protegidas.
- O sistema de filas e processamento é assíncrono e simula etapas de entrega da mensagem.
- O projeto está pronto para rodar com Docker e `.env`.

## Contribuição

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

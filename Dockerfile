# Imagem base
FROM node:18

# Cria diretório de trabalho
WORKDIR /app

# Copia arquivos
COPY package*.json ./
RUN npm install
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/main.js"]

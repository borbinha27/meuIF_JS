# Dockerfile
FROM node:22.11.0

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expo usa a porta 19000 para o app e 19002 para a web UI
EXPOSE 19000 19001 19002

# Comando padrão: iniciar o Expo com túnel
CMD ["npx", "expo", "start", "--tunnel"]

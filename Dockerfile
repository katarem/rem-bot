FROM node:22

# Instala FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./

# Instala las dependencias de tu bot
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto (si es necesario)
EXPOSE 3000

# Comando para iniciar el bot
CMD ["npm", "start"]
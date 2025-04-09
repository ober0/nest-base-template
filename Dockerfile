# Базовый образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm install

# Копируем Prisma схему для кеширования зависимостей
COPY prisma ./prisma

# Копируем весь проект
COPY . .

# Сборка проекта (будет создана папка /app/dist)
RUN npm run build

# Генерация Prisma Client
RUN npx prisma generate

# Запускаем приложение (при старте контейнера)
CMD ["npm", "run", "start:prod"]

FROM node:14.15-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY ./src src

CMD ["node", "./src/server.js"]

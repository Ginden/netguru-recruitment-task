FROM node:14.15-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY ./src src

RUN find /app/

# CMD ["find", "/app"]

ENTRYPOINT ["node", "./src/server.js"]

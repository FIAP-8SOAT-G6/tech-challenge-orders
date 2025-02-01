FROM node:lts-alpine

RUN adduser -D orders-api

ARG PORT_SERVER=8080
ENV PORT $PORT_SERVER

ARG API_PORT=8080
ENV API_PORT=${API_PORT}

EXPOSE $PORT

RUN mkdir -p /home/node/app

RUN chown -R orders-api /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY --chown=orders-api . .

USER orders-api

RUN npm run build

CMD [ "node", "build/index.js" ]
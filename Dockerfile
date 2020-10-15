FROM node:10-alpine

WORKDIR /usr/src/FastestWayServer

COPY package*.json ./

RUN yarn clean

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]
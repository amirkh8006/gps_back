FROM node:16-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

EXPOSE 9454

CMD [ "node", "server.js" ]


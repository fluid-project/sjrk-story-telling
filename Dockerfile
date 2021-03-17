FROM node:14.16.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install --only=production

COPY . .

EXPOSE 8081

CMD ["node", "index.js"]

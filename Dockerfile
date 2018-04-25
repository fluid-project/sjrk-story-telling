FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install --only=production

COPY . .

# TODO: update this when we change the directory, or make it configurable?
RUN mkdir -p ./tests/data/uploads

EXPOSE 8081

CMD ["node", "index.js"]

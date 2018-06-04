FROM node:10-alpine as builder

WORKDIR /app
COPY . /app

RUN apk add --no-cache --virtual build-dependencies git && \
    npm install && \
    npm cache clean --force && \
    apk del build-dependencies


FROM nginx:alpine

COPY --from=builder /app /usr/share/nginx/html

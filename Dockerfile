FROM node:10-alpine as builder

# Add OS-level dependencies
RUN apk add --no-cache git

# Switch to regular user
USER node

# Install npm dependencies
COPY --chown=node package.json /app/package.json
WORKDIR /app
RUN npm install

# Build final image
FROM nginx:alpine
COPY --from=builder /app /usr/share/nginx/html

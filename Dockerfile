FROM inclusivedesign/nodejs

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm install --only=production

COPY . .

# TODO: update this when we change the directory, or make it configurable?
RUN mkdir -p ./tests/data/uploads

EXPOSE 8081

CMD ["node", "index.js"]

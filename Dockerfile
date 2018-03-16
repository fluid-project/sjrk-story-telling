FROM inclusivedesign/nodejs

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm install --only=production

COPY . .

EXPOSE 8081

CMD ["node", "index.js"]

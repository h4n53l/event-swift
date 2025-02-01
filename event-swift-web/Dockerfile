# ./event-swift-web/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY ./event-swift-web ./event-swift-web

RUN npm install
RUN npm run build --prefix event-swift-web

EXPOSE 3000

CMD ["npm", "run", "start", "--prefix", "event-swift-web"]
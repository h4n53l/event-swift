
# ./user-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY ./user-service ./user-service

RUN npm install
RUN npm run build --prefix user-service

EXPOSE 3002

CMD ["npm", "run", "start", "--prefix", "user-service"]

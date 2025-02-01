FROM node:18-alpine

WORKDIR /app

RUN npm install -g express-gateway

COPY config ./config

EXPOSE 3001
EXPOSE 9876

CMD ["eg", "gateway", "start"]
FROM node:17.0.0-alpine

RUN apk add chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /home/node

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "whats-app-bot-events/index.js"]

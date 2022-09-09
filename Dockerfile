FROM node:16-alpine AS builder

WORKDIR /app

COPY src src
COPY .babelrc .babelrc
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY webpack.config.js webpack.config.js

RUN npm install
RUN npm run build

###############################################################################

FROM node:16-alpine

EXPOSE 3000
WORKDIR /app
VOLUME /app/data

RUN npm install -g concurrently
RUN npm install express@^4.18.1

COPY --from=builder /app/build/server.js .
COPY --from=builder /app/build/daemon.js .

CMD ["concurrently", "-r", "--kill-others-on-fail", "\"node ./daemon.js\"", "\"node ./server.js\""]

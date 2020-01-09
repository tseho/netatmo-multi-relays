FROM node:12-alpine AS builder

WORKDIR /src
COPY ./ /src
RUN npm install
RUN npm run build

FROM node:12-alpine

WORKDIR /app
COPY --from=builder /src/build/main.js .
CMD ["node", "./main.js"]

# FROM node:16

# WORKDIR /app

# COPY . .

# RUN yarn

# RUN npx tsc

# CMD [ "node", "bin/www" ]

FROM node:16 AS build-server

WORKDIR /app

COPY . .

RUN yarn

RUN npx tsc

FROM node:16-alpine AS server
WORKDIR /app
COPY package.json .
COPY bin bin
RUN yarn --prod
COPY --from=build-server /app/dist dist
CMD [ "node", "bin/www" ]


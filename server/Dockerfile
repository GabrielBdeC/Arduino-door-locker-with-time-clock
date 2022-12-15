FROM node:18 AS development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .

RUN yarn build
USER node



FROM node:18 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build

ARG NODE_ENV production
ENV NODE_ENV=${NODE_ENV}

RUN yarn install --frozen-lockfile --omit=dev && yarn cache clean --force

RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]

USER node



FROM node:18 AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh ./

ENTRYPOINT ["/entrypoint.sh"]
FROM node:18 AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

RUN npm run build
USER node



FROM node:18 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ARG NODE_ENV production
ENV NODE_ENV=${NODE_ENV}

RUN npm ci --omit=dev && npm cache clean --force

RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]

USER node



FROM node:18 AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh ./

ENTRYPOINT ["/entrypoint.sh"]
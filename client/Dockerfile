FROM node:22 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22 AS production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/client/server/server.mjs"]
EXPOSE 4000

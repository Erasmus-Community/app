FROM node:20-alpine as builder
WORKDIR /app

COPY package.json yarn.lock next.config.js ./
COPY .env.local ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine as runner
WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD [ "node", "server.js" ]
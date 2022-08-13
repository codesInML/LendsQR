FROM node:16.16.0-alpine
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY . .
COPY .env ./
RUN ls -a
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:16.16.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /app .
COPY .env ./
RUN ls -a
RUN npm install pm2 -g
EXPOSE 80
CMD pm2 start process.yml && tail -f /dev/null

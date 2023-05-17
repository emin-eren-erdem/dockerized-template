FROM node:14-alpine
RUN npm install --production
COPY . .
RUN npm run build
CMD [ "node", "./dist/index.js" ]

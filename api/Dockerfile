FROM mhart/alpine-node:10.8.0

ARG API_WORKDIR

WORKDIR $API_WORKDIR
COPY package*.json $API_WORKDIR/
RUN npm install

# Cache installation before
COPY server.js $API_WORKDIR/

CMD ["npx", "nodemon", "--legacy-watch", "server.js" ]

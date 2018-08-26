const path = require("path")

const { run, runIgnoreError, runAsync, loadConfig } = require('./lib')

function dev() {
  const config = {
    ...loadConfig('./db.dev.json'),
    ...loadConfig('./postgres.dev.json'),
    ...loadConfig('./network.dev.json')
  }

  const remove = `docker rm -f ${config.DB_NAME}`

  const build = `docker build -t ${config.DB_TAG} \
    --build-arg DB_WORKDIR=${config.DB_WORKDIR} \
    db/.`

  const volume = path.join(__dirname, 'db')

  const runContainer = `docker run -p ${config.POSTGRES_PORT}:${config.POSTGRES_PORT} -it \
    --volume ${volume}/db:${config.DB_WORKDIR}:ro \
    --network=${config.NETWORK_NAME} \
    --network-alias=${config.POSTGRES_HOST} \
    -e POSTGRES_USER=${config.POSTGRES_USER} \
    -e POSTGRES_PASSWORD=${config.POSTGRES_PASSWORD} \
    -e POSTGRES_HOST=${config.POSTGRES_HOST} \
    -e POSTGRES_PORT=${config.POSTGRES_PORT} \
    -e POSTGRES_DB=${config.POSTGRES_DB} \
    --name ${config.DB_NAME} \
    ${config.DB_TAG}`

  runIgnoreError(remove)
    .then(_ => runAsync(build))
    .then(_ => run(runContainer))
}

module.exports ={
  dev
}

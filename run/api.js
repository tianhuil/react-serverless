const path = require("path")

const { run, runIgnoreError, runAsync, loadConfig } = require('./lib')

function dev() {
  const config = {
    ...loadConfig('./postgres.dev.json'),
    ...loadConfig('./network.dev.json'),
    ...loadConfig('./api.dev.json')
  }

  const remove = `docker rm -f ${config.API_NAME}`

  const build = `docker build -t ${config.API_TAG} \
    --build-arg API_WORKDIR=${config.API_WORKDIR} \
    api/.`

  const volume = path.join(__dirname, '..', 'api')

  const runContainer = `docker run -p ${config.API_PORT}:${config.API_PORT} -it \
    --volume ${volume}:${config.API_WORKDIR}:ro \
    --network=${config.NETWORK_NAME} \
    -e API_PORT=${config.API_PORT} \
    -e POSTGRES_USER=${config.POSTGRES_USER} \
    -e POSTGRES_PASSWORD=${config.POSTGRES_PASSWORD} \
    -e POSTGRES_HOST=${config.POSTGRES_HOST} \
    -e POSTGRES_PORT=${config.POSTGRES_PORT} \
    -e POSTGRES_DB=${config.POSTGRES_DB} \
    --name ${config.API_NAME} \
    ${config.API_TAG}`

  runIgnoreError(remove)
    .then(_ => runAsync(build))
    .then(_ => run(runContainer))
}

module.exports = {
  dev
}

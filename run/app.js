const path = require("path")

const { run, runIgnoreError, runAsync, loadConfig } = require('./lib')

function dev() {
  const config = {
    ...loadConfig('./app.dev.json'),
    ...loadConfig('./api.dev.json'),
  }

  const remove = `docker rm -f ${config.APP_NAME}`

  const build = `docker build -t ${config.APP_TAG_DEV} \
    -f ./app/Dockerfile.Dev \
    --build-arg APP_WORKDIR=${config.APP_WORKDIR} \
    app/.`

  const volume = path.join(__dirname, '..', 'app', 'src')

  const runContainer = `docker run -p ${config.APP_PORT}:${config.APP_PORT} -it \
    --volume ${volume}:${config.APP_WORKDIR}/src:ro \
    --name ${config.APP_NAME} \
    -e API_HOST=${config.API_HOST} \
    -e API_PORT=${config.API_PORT} \
    -e APP_PORT=${config.APP_PORT} \
    ${config.APP_TAG_DEV}`

  runIgnoreError(remove)
    .then(_ => runAsync(build))
    .then(_ => run(runContainer))
}

module.exports = {
  dev
}

const { run, runIgnoreError, loadConfig } = require('./lib')

const config = loadConfig('./network.dev.json')

function dev() {
  runIgnoreError(`docker network rm ${config.NETWORK_NAME}`)
    .then(_ =>
      run(`docker network create --driver bridge ${config.NETWORK_NAME}`)
    )
}

module.exports ={
  dev
}

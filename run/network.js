const fs = require("fs")
const path = require('path')

const { run, runIgnoreError } = require('./lib')

const configPath = path.join(__dirname, './network.dev.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

function dev() {
  runIgnoreError(`docker network rm ${config.NETWORK_NAME}`)
    .then(_ =>
      run(`docker network create --driver bridge ${config.NETWORK_NAME}`)
    )
}

module.exports ={
  dev
}

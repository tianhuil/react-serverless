const fs = require("fs")
const path = require("path")

const { run, options, help } = require('runjs')

function runIgnoreError(cmd, options) {
  return run(cmd, {...options, stdio: 'pipe', async: true})
    .catch(_ => 0)
}

function runAsync(cmd, options) {
  return run(cmd, {...options, async: true})
}

function loadConfig(file) {
  const configPath = path.join(__dirname, file)
  return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

module.exports = {
  runSync,
  runIgnoreError,
  runAsync,
  options,
  help,
  loadConfig
}
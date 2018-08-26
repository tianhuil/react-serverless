const { run, options, help } = require('runjs')

function runIgnoreError(cmd, options) {
  return run(cmd, {...options, stdio: 'pipe', async: true})
    .catch(_ => 0)
}

module.exports = {
  run,
  runIgnoreError,
  options,
  help
}
/*
This is the task runner.  Sample commands:

run db:dev

services include: db, api, app
commands include: dev, prod, test
*/

const { run, options } = require('runjs')
const network = require('./run/network')
const db = require('./run/db')

module.exports = {
  network,
  db
}

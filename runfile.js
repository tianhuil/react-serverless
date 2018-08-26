/*
This is the task runner.  Sample commands:

run db:dev

services include: db, api, app
commands include: dev, prod, test
*/

const network = require('./run/network')
const db = require('./run/db')
const api = require('./run/api')
const app = require('./run/app')

module.exports = {
  network,
  db,
  api,
  app
}

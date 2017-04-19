'use strict'

const request = require('request')
const Task = require('data.task')
const Either = require('data.either')
const {List} = require('immutable-ext')

// eitherToTask :: Either -> Task (Error Object)
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

// parse :: String -> Either(Error, Object)
const parse = Either.try(JSON.parse)

// getHTTP :: String -> Task(Error, String)
const getHTTP = url =>
  new Task((reject, resolve) =>
    request({
      url: url,
      headers: {
        'User-Agent': 'request'
      }
    }, (error, response, body) =>
      error ? reject(error) : resolve(body)))

// starred :: String -> [Object]
const starred = username =>
  getHTTP(`https://api.github.com/users/${username}/starred?per_page=100`)
    .map(parse)
    .chain(eitherToTask)
    .map(result => result.map(repos => repos.name))

module.exports = {
  starred
}

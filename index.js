'use strict'

const Task = require('data.task')
const Either = require('data.either')
const {List} = require('immutable-ext')
const {starred} = require('./github')

const argv = new Task((reject, resolve) => resolve(process.argv))
const usernames = argv.map(args => args.slice(2))

const Intersection = xs =>
({
  xs,
  concat: ({xs: ys}) =>
    Intersection(xs.filter(x => ys.some(y => x === y)))
})

const Sum = x =>
({
  x,
  concat: ({x: y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
})

const Pair = (x, y) =>
({
  x,
  y,
  bimap: (f, g) => Pair(f(x), g(y)),
  toList: () => [x, y],
  concat: ({x: x1, y: y1}) =>
    Pair(x.concat(x1), y.concat(y1)),
  inspect: () => `Pair(${x}, ${y})`
})

// starredIntersection :: List Stars -> Pair(Intersection(Stars), String)
const starredIntersection = stars =>
  stars
    .foldMap(x => Pair(Intersection(x), Sum(x.length)))
    .bimap(x => x.xs, y => `Stars checked: ${y.x}`)
    .toList()

// main :: [String] -> Task(Error Object)
const main = names =>
  List(names)
  .traverse(Task.of, starred)
  .map(starredIntersection)

usernames.chain(main).fork(console.error, console.log)

module.exports = {
  main
}

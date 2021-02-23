const Fuse = require("fuse.js")

const obj = [
  {"cat": "Dairy", "ing": "milk"},
  {"cat": "Dairy", "ing": "butter"},
  {"cat": "Dairy", "ing": "cream"},
  {"cat": "Frozen", "ing": "ice cream"},
  {"cat": "Condiments", "ing": "peanut butter"}
]

const options = {
  includeScore: true,
  keys: ["ing"]
}

const fuse = new Fuse(obj, options)

console.log(fuse.search("peanut butter"))
console.log(fuse.search("ice cream"))
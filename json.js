'use strict'

var jsonMarkup = require('json-markup')
var css = require('insert-styles')
var toVdom = require('html-to-vdom')({
  VNode: require('virtual-dom/vnode/vnode'),
  VText: require('virtual-dom/vnode/vtext')
})

module.exports = {
  render: render
}

function render (data) {
  data = JSON.parse(JSON.stringify(data))
  return toVdom(jsonMarkup(data))
}

css(`.json-markup {
  line-height: 17px;
  font-size: 13px;
  font-family: monospace;
  white-space: pre;
}
.json-markup-key {
  font-weight: bold;
}
.json-markup-bool {
  color: firebrick;
}
.json-markup-string {
  color: green;
}
.json-markup-null {
  color: gray;
}
.json-markup-number {
  color: blue;
}`)

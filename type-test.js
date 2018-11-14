'use strict'

var test = require('tape')
var proxyquire = require('proxyquire')

test('input type', function (t) {
  t.equal(proxyquire('./type', { 'is-android': true }), 'tel')
  t.equal(proxyquire('./type', { 'is-android': false }), 'text')
  t.end()
})

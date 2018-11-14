'use strict'

var State = require('dover')
var Observ = require('observ')
var value = require('observ-value')
var pipe = require('value-pipe')

var h = require('virtual-dom/h')
var changeEvent = require('value-event/change')
var extend = require('xtend')
var numeric = require('numeric-pattern')
var card = require('creditcards').card
var cvc = require('creditcards').cvc

var TYPE = require('./type')
var NAME = 'cc-csc'

module.exports = CardNumberInput

function CardNumberInput (data) {
  data = data || {}

  return State({
    value: Observ(data.value || ''),
    channels: {
      change: change
    }
  })
}

function change (state, data) {
  pipe(card.parse, state.value.set)(data[NAME])
}

CardNumberInput.validate = function validate (state, type) {
  var code = value(state.value)
  return cvc.isValid(code, type)
}

CardNumberInput.render = function render (state, options) {
  return h('input', extend({
    name: NAME,
    autocomplete: NAME,
    type: TYPE,
    placeholder: 'CVC',
    pattern: numeric,
    maxLength: 4,
    value: state.value,
    'ev-event': changeEvent(state.channels.change)
  }, options))
}

'use strict'

var State = require('dover')
var Observ = require('observ')
var value = require('observ-value')
var pipe = require('value-pipe')
var partial = require('ap').partial

var h = require('virtual-dom/h')
var changeEvent = require('value-event/change')
var extend = require('xtend')
var numeric = require('numeric-pattern')
var card = require('creditcards/card')

var TYPE = require('./type')
var NAME = 'cc-number'

module.exports = CardNumberInput

function CardNumberInput (data) {
  data = data || {}

  return State({
    raw: Observ(data.raw || ''),
    value: Observ(data.value || null),
    channels: {
      change: change
    }
  })
}

function change (state, data) {
  var value = data[NAME]

  // Truncates invalid card patterns
  var reformat = pipe(card.parse, card.format, card.parse)
  var number = value ? reformat(value) : ''

  state.set({
    raw: number,
    value: parse(number)
  })
}

function parse (number) {
  return number && card.type(number) ? number : null
}

CardNumberInput.validate = function validate (state, types) {
  var number = value(state.value)
  if (!number) return
  types = types || []
  if (!types.length) return card.isValid(number)
  return types.some(partial(card.isValid, number))
}

CardNumberInput.render = function render (state, options) {
  return h('input', extend({
    name: NAME,
    autocomplete: NAME,
    type: TYPE,
    placeholder: 'Card number',
    pattern: numeric,
    value: card.format(state.value || card.parse(state.raw)),
    'ev-event': changeEvent(state.channels.change)
  }, options))
}

'use strict'

var State = require('dover')
var Observ = require('observ')
var ObservArray = require('observ-array')
var value = require('observ-value')
var pipe = require('value-pipe')
var partial = require('ap').partial

var h = require('virtual-dom/h')
var changeEvent = require('value-event/change')
var numeric = require('numeric-pattern')
var card = require('creditcards/card')

var NAME = 'cc-number'

module.exports = CardNumberInput

function CardNumberInput (data) {
  data = data || {}

  return State({
    value: Observ(data.value || ''),
    types: ObservArray(data.types || []),
    channels: {
      change: change
    }
  })
}

function change (state, data) {
  pipe(card.parse, state.value.set)(data[NAME])
}

CardNumberInput.validate = function validate (state) {
  var number = value(state.value)
  var types = value(state.types)
  if (!types.length) return card.isValid(number)
  return types.some(partial(card.isValid, number))
}

CardNumberInput.render = function render (state) {
  return h('input', {
    name: NAME,
    autocomplete: NAME,
    type: 'text',
    placeholder: 'Card number',
    pattern: numeric,
    value: card.format(state.value),
    'ev-event': changeEvent(state.channels.change)
  })
}

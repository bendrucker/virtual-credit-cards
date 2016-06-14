'use strict'

var State = require('dover')
var Observ = require('observ')
var h = require('virtual-dom/h')
var changeEvent = require('value-event/change')
var types = require('creditcards/types')
var card = require('creditcards/card')

var NumberInput = require('./number')
var ExpirationInput = require('./expiration')
var CvcInput = require('./cvc')

module.exports = CreditCardForm

function CreditCardForm (data) {
  data = data || {}

  return State({
    types: Types(types),
    number: NumberInput(),
    expiration: ExpirationInput(),
    cvc: CvcInput(),
    channels: {
      setType: setType
    }
  })
}

function setType (state, data) {
  state.types[data.name].set(data.value)
}

CreditCardForm.render = function render (state) {
  return h('form', [
    h('link', {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/foundation/6.2.1/foundation.min.css'
    }),
    h('.row', [
      h('label.small-12.columns', [
        'Card number',
        NumberInput.render(state.number, renderStyle(NumberInput.validate(state.number, Object.keys(state.types).filter(name => state.types[name]))))
      ])
    ]),
    h('.row', [
      h('label.small-6.columns', [
        'Expiration',
        ExpirationInput.render(state.expiration, renderStyle(ExpirationInput.validate(state.expiration)))
      ]),
      h('label.small-6.columns', [
        'Expiration',
        CvcInput.render(state.cvc, renderStyle(CvcInput.validate(state.cvc, card.type(state.number.value))))
      ])
    ]),
    h('.row.small-12.columns', renderTypeControls(state))
  ])
}

function renderTypeControls (state) {
  return h('fieldset.fieldset', [
    h('legend', 'Allowed card types'),
    Object.keys(state.types).map(function (type, index) {
      var id = 'card-type-' + index
      var checked = state.types[type]
      return h('.medium-6.columns', [
        h('input', {
          id: id,
          name: id,
          type: 'checkbox',
          checked: state.types[type],
          'ev-event': changeEvent(state.channels.setType, {
            name: type,
            value: !checked
          })
        }),
        h('label', {attributes: {for: id}}, type)
      ])
    })
  ])
}

function Types (types) {
  var data = Object.keys(types.types)
    .map(type => types.types[type])
    .filter(type => type instanceof types.Type)
    .reduce((acc, type) => {
      acc[type.name] = Observ(true)
      return acc
    }, {})

  return State(data)
}

function renderStyle (valid) {
  return {
    style: {
      borderStyle: '1px solid',
      borderColor: valid ? 'green' : 'red'
    }
  }
}

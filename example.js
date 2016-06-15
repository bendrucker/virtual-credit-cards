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

var json = require('./json')

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
        NumberInput.render(state.number, renderStyle(NumberInput.validate(state.number, Object.keys(state.types).filter(function (name) { return state.types[name] }))))
      ])
    ]),
    h('.row', [
      h('label.small-6.columns', [
        'Expiration',
        ExpirationInput.render(state.expiration, renderStyle(ExpirationInput.validate(state.expiration)))
      ]),
      h('label.small-6.columns', [
        'CVC',
        CvcInput.render(state.cvc, renderStyle(CvcInput.validate(state.cvc, card.type(state.number.value))))
      ])
    ]),
    h('.row.small-12.columns', renderTypeControls(state)),
    h('.row.small-12.columns', [
      h('.callout', json.render({
        types: Object.keys(state.types).filter(function (type) { return state.types[type] }),
        number: {
          value: state.number.value,
          type: {
            eager: card.type(state.number.value, true) || null,
            strict: card.type(state.number.value) || null
          },
          valid: NumberInput.validate(state.number, Object.keys(state.types).filter(function (type) { return state.types[type] }))
        },
        expiration: {
          raw: state.expiration.raw,
          value: state.expiration.value,
          valid: ExpirationInput.validate(state.expiration)
        },
        cvc: {
          value: state.cvc.value,
          valid: CvcInput.validate(state.cvc, card.type(state.number.value))
        }
      }))
    ])
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
    .map(function (type) { return types.types[type] })
    .filter(function (type) { return type instanceof types.Type })
    .reduce(function (acc, type) {
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

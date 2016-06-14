'use strict'

var State = require('dover')
var Observ = require('observ')
var pad = require('zero-fill')(2)

var h = require('virtual-dom/h')
var numeric = require('numeric-pattern')
var changeEvent = require('value-event/change')

var NAME = 'cc-exp'

module.exports = ExpirationInput

function ExpirationInput (data) {
  data = data || {}

  return State({
    raw: Observ(data.raw || ''),
    value: Observ(data.value || {}),
    channels: {
      change: change
    }
  })
}

function change (state, data) {
  state.raw.set(data[NAME])
}

ExpirationInput.render = function render (state) {
  return h('input', {
    name: NAME,
    autocomplete: NAME,
    type: 'text',
    placholder: 'MM / YY',
    pattern: numeric,
    value: format(state.value) || reformat(state.raw),
    'ev-event': changeEvent(state.channels.change)
  })
}

function format (expiration) {
  if (!expiration.month || !expiration.year) return
  return [pad(expiration.month), String(expiration.year).substring(2, 4)].join(' / ')
}

function reformat (raw) {
  if (!raw) return ''
  var parts = raw.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/)
  if (!parts) return ''

  var month = parts[1] || ''
  var separator = parts[2] || ''
  var year = parts[3] || ''

  if (year.length > 0) {
    separator = ' / '
  } else if (separator === ' /') {
    month = month.substring(0, 1)
    separator = ''
  } else if (month.length === 2 || separator) {
    separator = ' / '
  } else if (month.length === 1 && month !== '0' && month !== '1') {
    month = '0' + month
    separator = ' / '
  }

  return [month, separator, year].join('')
}

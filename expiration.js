'use strict'

var State = require('dover')
var Observ = require('observ')
var value = require('observ-value')
var pad = require('zero-fill')(2)

var h = require('virtual-dom/h')
var extend = require('xtend')
var numeric = require('numeric-pattern')
var changeEvent = require('value-event/change')
var expiration = require('creditcards/expiration')

var TYPE = require('./type')
// MM / YY
var MM_YY = /^\D*(\d{1,2})(\D+)?(\d{1,4})?/
// Specific name helps autofill kick in
var NAME = 'cc-exp'
var SEPARATOR = ' / '

module.exports = ExpirationInput

function ExpirationInput (data) {
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
  state.set({
    raw: value,
    value: parse(value)
  })
}

ExpirationInput.validate = function validate (state) {
  var data = value(state.value)

  return Boolean(data) &&
    expiration.month.isValid(data.month) &&
    expiration.year.isValid(data.year) &&
    !expiration.isPast(data.month, data.year)
}

ExpirationInput.render = function render (state, options) {
  return h('input', extend({
    name: NAME,
    autofill: NAME,
    type: TYPE,
    placeholder: 'MM' + SEPARATOR + 'YY',
    pattern: numeric,
    maxLength: 2 + SEPARATOR.length + 4,
    value: format(state.value) || reformat(state.raw),
    'ev-event': changeEvent(state.channels.change)
  }, options))
}

function parse (raw) {
  var parts = raw.match(MM_YY)
  if (!parts) return null

  var rawMonth = parts[1]
  var rawYear = parts[3]

  if (!rawYear || rawYear.length % 2) return null

  return {
    month: expiration.month.parse(rawMonth),
    year: expiration.year.parse(rawYear, rawYear.length < 4)
  }
}

function format (expiration) {
  if (!expiration) return
  return [
    pad(expiration.month),
    expiration.year >= 2000 && expiration.year <= 2100
      ? String(expiration.year).substring(2)
      : expiration.year
  ]
  .join(SEPARATOR)
}

function reformat (raw) {
  if (!raw) return ''
  var parts = raw.match(MM_YY)
  if (!parts) return ''

  var month = parts[1] || ''
  var separator = parts[2] || ''
  var year = parts[3] || ''

  if (year.length > 0) {
    separator = SEPARATOR
  } else if (separator === ' /') {
    month = month.substring(0, 1)
    separator = ''
  } else if (month.length === 2 || separator) {
    separator = SEPARATOR
  } else if (month.length === 1 && month !== '0' && month !== '1') {
    month = '0' + month
    separator = ' / '
  }

  return [month, separator, year].join('')
}

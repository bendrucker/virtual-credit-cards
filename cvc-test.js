'use strict'

var test = require('tape')
var thermometer = require('thermometer')
var dispatch = require('dispatch-event')
var Cvc = require('./cvc')

test('cvc input', function (t) {
  t.test('dom to state', function (t) {
    t.plan(2)

    var render = thermometer.createComponent(Cvc)

    render(function (state, element, done) {
      element.value = '123'
      dispatch(element, 'input')
      t.equal(state.value(), '123', 'stores the digits')
      element.value = '12a'
      dispatch(element, 'input')
      t.equal(state.value(), '12', 'strips invalid characters')
      done()
    })
  })

  t.test('validate', function (t) {
    t.ok(Cvc.validate(Cvc({
      value: '123'
    })), 'valid: 3 digit untyped')

    t.ok(Cvc.validate(Cvc({
      value: '1234'
    })), 'valid: 4 digit untyped')

    t.notOk(Cvc.validate(Cvc({
      value: '12'
    })), 'invalid: 2 digit')

    t.notOk(Cvc.validate(Cvc({
      value: '1234',
      type: 'Visa'
    })), 'invalid: 4 digit Visa')

    t.ok(Cvc.validate(Cvc({
      value: '123',
      type: 'Visa'
    })), 'valid: 3 digit Visa')

    t.ok(Cvc.validate(Cvc({
      value: '1234',
      type: 'American Express'
    })), 'valid: 4 digit Amex')

    t.end()
  })
})

'use strict'

var test = require('tape')
var thermometer = require('thermometer')
var dispatch = require('dispatch-event')
var createElement = require('virtual-dom/create-element')
var NumberInput = require('./number')

test('expiration', function (t) {
  t.test('state to dom', function (t) {
    assertFormatted('40222', '4022 2')
    t.end()

    function assertFormatted (input, output) {
      var state = NumberInput({
        value: input
      })
      t.equal(createElement(NumberInput.render(state())).value, output, `format: ${JSON.stringify(input)} -> "${output}"`)
    }
  })

  t.test('dom to state', function (t) {
    t.plan(2)
    var render = thermometer.createComponent(NumberInput)

    render(function (state, element, done) {
      t.equal(state.value(), '', 'initial value is empty')

      element.value = '4022a'
      dispatch(element, 'input')
      t.equal(state.value(), '4022', 'stores numeric input')
    })
  })

  t.test('validate', function (t) {
    t.ok(NumberInput.validate(NumberInput({
      value: ['4242', '4242', '4242', '4242'].join('')
    })), 'valid with no types')

    t.ok(NumberInput.validate(NumberInput({
      value: ['4242', '4242', '4242', '4242'].join('')
    }), ['Visa']), 'valid with matched type')

    t.notOk(NumberInput.validate(NumberInput({
      value: ['4242', '4242', '4242', '4242'].join('')
    }), ['American Express']), 'invalid with invalid type')

    t.notOk(NumberInput.validate(NumberInput({
      value: ['442', '4242', '4242', '4242'].join('')
    })), 'invalid with bad card and no types')

    t.end()
  })
})

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
    t.plan(7)
    var render = thermometer.createComponent(NumberInput)

    render(function (state, element, done) {
      t.equal(state.raw(), '', 'initial value is empty')

      element.value = '4022a'
      dispatch(element, 'input')
      t.equal(state.raw(), '4022', 'stores numeric input')
      t.equal(state.value(), null, 'value is null until valid')

      element.value = '5115 0000 0000 1234'
      dispatch(element, 'input')
      t.equal(state.raw(), '5115000000001234')
      t.equal(state.value(), '5115000000001234', 'value is defined when valid')

      element.value = '5115 0000 0000 12340'
      dispatch(element, 'input')
      t.equal(state.raw(), '5115000000001234', 'prevents overtyping into raw')
      t.equal(state.value(), '5115000000001234', 'prevents overtyping into value')
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

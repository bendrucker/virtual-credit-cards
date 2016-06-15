'use strict'

var test = require('tape')
var thermometer = require('thermometer')
var dispatch = require('dispatch-event')
var createElement = require('virtual-dom/create-element')
var raf = require('raf')
var Expiration = require('./expiration')

test('expiration', function (t) {
  t.test('state to dom', function (t) {
    assertFormatted('', '')
    assertFormatted(' ', '')
    assertFormatted('01', '01 / ')
    assertFormatted('0', '0')
    assertFormatted('1', '1')
    assertFormatted('2', '02 / ')
    assertFormatted('12 /', '1')
    assertFormatted('12 / 1', '12 / 1')

    assertFormatted({month: 2, year: 2020}, '02 / 20')

    t.end()

    function assertFormatted (input, output) {
      var state = Expiration({
        raw: typeof input === 'string' && input,
        value: typeof input === 'object' && input
      })
      t.equal(createElement(Expiration.render(state())).value, output, `format: ${JSON.stringify(input)} -> "${output}"`)
    }
  })

  t.test('dom to state', function (t) {
    t.plan(9)
    var render = thermometer.createComponent(Expiration)

    render(function (state, element, done) {
      t.equal(state.value(), null, 'initial value is null')

      element.value = '01 / 20'
      dispatch(element, 'input')
      t.equal(state.raw(), '01 / 20', 'stores input value as raw')
      t.deepEqual(state.value(), {month: 1, year: 2020}, 'stores parsed exp as value')

      element.value = ''
      dispatch(element, 'input')
      t.equal(state.value(), null, 'resets value with no match')

      element.value = '01 / 2'
      dispatch(element, 'input')
      t.equal(state.value(), null, 'requires minimum 2 digit year')

      element.value = '01 / 201'
      dispatch(element, 'input')
      t.equal(state.value(), null, 'resets value while typing 4 digit year')

      element.value = '01 / 2018'
      dispatch(element, 'input')
      t.deepEqual(state.value(), {month: 1, year: 2018})
      raf(function () {
        t.equal(element.value, '01 / 18', 'reformats MM/YYYY to MM/YY')

        element.value = '01 / 1500'
        dispatch(element, 'input')
        raf(function () {
          t.equal(element.value, '01 / 1500', 'does not truncate non-2000 dates')
        })
      })
    })
  })

  t.test('validate', function (t) {
    t.notOk(Expiration.validate(Expiration()), 'initially invalid')
    t.notOk(Expiration.validate(Expiration({
      value: {
        month: 1,
        year: 2016
      }
    })), 'invalid if past')
    t.ok(Expiration.validate(Expiration({
      value: {
        month: 1,
        year: 2050
      }
    })), 'valid if future')
    t.end()
  })
})

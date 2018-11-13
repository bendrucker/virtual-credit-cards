# virtual-credit-cards [![Build Status](https://travis-ci.org/bendrucker/virtual-credit-cards.svg?branch=master)](https://travis-ci.org/bendrucker/virtual-credit-cards) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/virtual-credit-cards.svg)](https://greenkeeper.io/)

> Credit card form components built with virtual-dom


## Install

```
$ npm install --save virtual-credit-cards
```

## Demo

```sh
$ npm run example
```

An example form (*example.js*) will open up in your default browser with all three components connected.

## Usage

virtual-credit-cards comes with inputs for:

* Card numbers
* Expiration (MM/YY)
* CVC

```js
var NumberInput = require('virtual-credit-cards/number')

var state = NumberInput()
NumberInput.render(state())
//=> VTree
```

## Components

### Number

#### `NumberInput()` -> `function`

Returns the observable number input state. `state.value` is an observable representation of the parsed card number.

#### `NumberInput.render(state, [options])` -> `object`

Renders a state object into a virtual DOM tree. 

#### `NumberInput.validate(state, [types])` -> `boolean`

Validates the current card number state.

##### types

Type: `array`  
Default: `[]`

An array of [allowed card types](https://github.com/bendrucker/creditcards-types#card-types). If no value is provided, a valid card of any type will be valid.
 
### Expiration

#### `ExpirationInput()` -> `function`

Returns the observable number input state. `state.value` is an observable representation of the parsed expiration. It will either be `null` or `{month: Number, year: Number}`, depending on whether the input is complete.

#### `ExpirationInput.render(state, [options])` -> `object`

Renders a state object into a virtual DOM tree. 

#### `ExpirationInput.validate(state)` -> `boolean`

Validates the expiration state.

### CVC

#### `CvcInput()` -> `function`

Returns the observable number input state. `state.value` is an observable representation of the parsed CVC.

#### `CvcInput.render(state, [options])` -> `object`

Renders a state object into a virtual DOM tree. 

#### `CvcInput.validate(state, [type])` -> `boolean`

Validates the CVC state. 

##### type

Type: `string`  
Default: `null`

If a [card type](https://github.com/bendrucker/creditcards-types#card-types) is provided, the validator will check that the provided CVC is valid for that card type.


## License

MIT © [Ben Drucker](http://bendrucker.me)

'use strict';

class Model {
  constructor(value = 0) {
    this._value = value
  }

  get value() {
    return this._value
  }

  increment() {
    this._value++
  }
}
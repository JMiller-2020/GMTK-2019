'use strict';

class Controller {
  constructor() {
    this._mouseDown = false
    this._initController()
  }

  get isMouseDown() {
    return this._mouseDown
  }

  _initController() {
    document.addEventListener('mousedown', () => { this._mouseDown = true })
    document.addEventListener('mouseup', () => { this._mouseDown = true })
  }
}
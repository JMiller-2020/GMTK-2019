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
    document.addEventListener('mousedown', this._handleMouseDown.bind(this))
    document.addEventListener('mouseup', this._handleMouseUp.bind(this))
  }

  _handleMouseDown() {
    this._mouseDown = true
  }

  _handleMouseUp() {
    this._mouseDown = false
  }
}
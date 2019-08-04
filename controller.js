'use strict';

class Controller {
  constructor() {
    this._mouseDown = false
    this._initController()
  }

  get isMouseDown() {
    return this._mouseDown
  }

  get buttonMap() {
    return {
      'mouseDown': this.isMouseDown,
      'up': this._up,
      'down': this._down,
      'left': this._left,
      'right': this._right,
      'jump': this._jump
    }
  }

  _initController() {
    document.addEventListener('mousedown', this._handleMouseDown.bind(this))
    document.addEventListener('mouseup', this._handleMouseUp.bind(this))

    document.addEventListener('keydown', this._handleKey.bind(this))
    document.addEventListener('keyup', this._handleKey.bind(this))
  }

  _handleMouseDown() {
    this._mouseDown = true
  }

  _handleMouseUp() {
    this._mouseDown = false
  }

  _handleKey(e) {
    const isDown = e.type == 'keydown'
    switch(e.code) {
      case 'KeyW':
        this._up = isDown
        break
      case 'KeyS':
        this._down = isDown
        break
      case 'KeyA':
        this._left = isDown
        break
      case 'KeyD':
        this._right = isDown
        break
      case 'Space':
        this._jump = isDown
        break
    }
  }
}
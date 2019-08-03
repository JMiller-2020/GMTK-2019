'use strict';

class View {
  constructor(canvas) {
    this._cvs = canvas
    this._initView()
    this.background = '#000000'
  }

  _initView() {
    this._ctx = this._cvs.getContext('2d')
  }

  clear() {
    this._ctx.fillStyle = this.background
    this._ctx.fillRect(0, 0, this._w, this._h)
  }
  
  drawPlayer(x, y, w, h) {
    this._ctx.fillStyle = '#af4f4f'
    this._ctx.fillRect(x, y, w, h)
  }

  resize(w, h) {
    this._w = this._cvs.width = w
    this._h = this._cvs.height = h
  }
}
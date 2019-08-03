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

  setBounds(x1, y1, x2, y2) {
    this._x1 = x1
    this._y1 = y1
    this._x2 = x2
    this._y2 = y2
  }

  toCvsX(x) {
    return this.toCvsW(x - this._x1)
  }

  toCvsY(y) {
    return this.toCvsH(y - this._y1)
  }

  toCvsW(w) {
    return Math.round(w / (this._x2 - this._x1) * this._w)
  }

  toCvsH(h) {
    return Math.round(h / (this._y2 - this._y1) * this._h)
  }

  clear() {
    this._ctx.fillStyle = this.background
    this._ctx.fillRect(0, 0, this._w, this._h)
  }

  drawWorld(tiles, columns) {
    this._ctx.fillStyle = '#557555'
    const tw = 1
    const th = 1
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < tiles.length / columns; y++) {
        if (tiles[y * columns + x]) {
          const cvsX = this.toCvsX(x)
          const cvsY = this.toCvsY(y)
          const cvsW = this.toCvsW(tw)
          const cvsH = this.toCvsH(th)
          this._ctx.fillRect(cvsX, cvsY, cvsW, cvsH)
        }
      }
    }
  }

  drawPlayer(x, y, w, h) {
    this._ctx.fillStyle = '#af4f4f'
    const cvsX = this.toCvsX(x)
    const cvsY = this.toCvsY(y)
    const cvsW = this.toCvsW(w)
    const cvsH = this.toCvsH(h)
    this._ctx.fillRect(cvsX, cvsY, cvsW, cvsH)
  }

  resize(w, h) {
    this._w = this._cvs.width = w
    this._h = this._cvs.height = h
  }
}
'use strict';

class View {
  public background

  private cvs
  private ctx
  private w: number
  private h: number
  private left: number
  private top: number
  private right: number
  private bottom: number
  constructor(canvas) {
    this.cvs = canvas
    this._initView()
    this.background = '#000000'
  }

  _initView() {
    this.ctx = this.cvs.getContext('2d')
  }

  setBounds(left, top, right, bottom) {
    this.left = left
    this.top = top
    this.right = right
    this.bottom = bottom
  }

  toCvsX(x) {
    return this.toCvsW(x - this.left)
  }

  toCvsY(y) {
    return this.toCvsH(y - this.top)
  }

  toCvsW(w) {
    return Math.round(w / (this.right - this.left) * this.w)
  }

  toCvsH(h) {
    return Math.round(h / (this.bottom - this.top) * this.h)
  }

  clear() {
    this.ctx.fillStyle = this.background
    this.ctx.fillRect(0, 0, this.w, this.h)
  }

  drawWorld(tiles, columns) {
    this.ctx.fillStyle = '#557555'
    const tw = 1
    const th = 1
    for(let x = 0; x < columns; x++) {
      for(let y = 0; y < tiles.length / columns; y++) {
        if(tiles[y * columns + x]) {
          const cvsX = this.toCvsX(x)
          const cvsY = this.toCvsY(y)
          const cvsW = this.toCvsW(tw)
          const cvsH = this.toCvsH(th)
          this.ctx.fillRect(cvsX, cvsY, cvsW, cvsH)
        }
      }
    }
  }
  
  drawPlayer(x, y, w, h) {
    this.ctx.fillStyle = '#af4f4f'
    const cvsX = this.toCvsX(x)
    const cvsY = this.toCvsY(y)
    const cvsW = this.toCvsW(w)
    const cvsH = this.toCvsH(h)
    this.ctx.fillRect(cvsX, cvsY, cvsW, cvsH)
  }

  resize(w, h) {
    this.w = this.cvs.width = w
    this.h = this.cvs.height = h
  }
}
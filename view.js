'use strict';


class View {
  constructor(canvas) {
    this._cvs = canvas
    this._initView()
    this.background = "#000000"
  }

  _initView() {
    this._ctx = this._cvs.getContext('2d')
  }

  setBounds(x1, y1, x2, y2) {
    this._l = x1
    this._t = y1
    this._r = x2
    this._b = y2
  }

  setTileSheet(tileSheet, tileSize=16) {
    this.tileSheet = new TileSheet(tileSheet, tileSize)

    console.log('spritesheet:',
        `${tileSheet.naturalWidth}x${tileSheet.naturalHeight}`,
        `(${this.tileSheet.numColumns}x${this.tileSheet.numRows})`)
  }

  indexToCvsXYWH(idx, c) {
    const x = idx % c
    const y = Math.floor(idx / c)
    const w = this._r - this._l
    const h = this._b - this._t
    return [
      (x - this._l) / w * this._w,
      (y - this._t) / h * this._h,
      this._w / w,
      this._h / h
    ]
  }

  toCvsX(x) {
    return this.toCvsW(x - this._l)
  }

  toCvsY(y) {
    return this.toCvsH(y - this._t)
  }

  toCvsW(w) {
    return Math.round(w / (this._r - this._l) * this._w)
  }

  toCvsH(h) {
    return Math.round(h / (this._b - this._t) * this._h)
  }

  clear() {
    this._ctx.fillStyle = this.background
    this._ctx.fillRect(0, 0, this._w, this._h)
  }

  drawWorld(tiles, c) {
    this._ctx.fillStyle = '#557555'
    for (let i = 0; i < tiles.length; i++) {
      const textureIdx = tiles[i]
      this._ctx.drawImage(this.tileSheet.img,
          ...this.tileSheet.indexToXYWH(textureIdx),
          ...this.indexToCvsXYWH(i, c))
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

class TileSheet {
  constructor(img, tileSize) {
    this.img = img
    this._tileSize = tileSize
    if(img.naturalWidth % tileSize != 0) {
      console.log(`bad tile sheet width: ${tileSheet.naturalWidth} % ${tileSize} != 0`)
    }
    if(img.naturalHeight % tileSize != 0) {
      console.log(`bad tile sheet height: ${tileSheet.naturalHeight} % ${tileSize} != 0`)
    }
  }

  get numColumns() {
    this.img.naturalWidth / this._tileSize
  }

  get numRows() {
    this.img.naturalHeight / this._tileSize
  }

  get tileSize() {
    return this._tileSize
  }

  indexToXYWH(idx) {
    return [
      idx % this.tileSize,
      Math.floor(idx / this.tileSize),
      1,
      1
    ].map(_ => _ * this.tileSize)
  }
}

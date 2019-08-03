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

  xywhToCvsXYWH(x, y, w, h) {
    const mw = this._r - this._l
    const mh = this._b - this._t
    return [
      (x - this._l) / mw * this._w,
      (y - this._t) / mh * this._h,
      w / mw * this._w,
      h / mh * this._h
    ]
  }

  indexToCvsXYWH(idx, c) {
    const x = idx % c
    const y = Math.floor(idx / c)
    return this.xywhToCvsXYWH(x, y, 1, 1)
  }

  clear() {
    this._ctx.fillStyle = this.background
    this._ctx.fillRect(0, 0, this._w, this._h)
  }

  drawWorld(texIdxs, c) {
    this._ctx.fillStyle = '#557555'
    for (let i = 0; i < texIdxs.length; i++) {
      const texIdx = texIdxs[i]
      this._ctx.drawImage(this.tileSheet.img,
          ...this.tileSheet.indexToXYWH(texIdx),
          ...this.indexToCvsXYWH(i, c))
    }
  }

  drawPlayer(x, y, w, h) {
    this._ctx.fillStyle = '#af4f4f'
    this._ctx.fillRect(...this.xywhToCvsXYWH(x, y, w, h))
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

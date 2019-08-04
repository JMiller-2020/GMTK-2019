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

  setTileSheet(tileSheet, tileSize = 16) {
    this.tileSheet = new SpriteSheet(tileSheet, tileSize)

    console.log('spritesheet:',
      `${tileSheet.naturalWidth}x${tileSheet.naturalHeight}`,
      `(${this.tileSheet.numColumns}x${this.tileSheet.numRows})`)
  }

  xywhToCvsXYWH(x, y, w, h) {
    const mw = this._r - this._l
    const mh = this._b - this._t
    return [
      Math.round((x - this._l) / mw * this._w),
      Math.round((y - this._t) / mh * this._h),
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
    for (let i = 0; i < texIdxs.length; i++) {
      const texIdx = texIdxs[i]
      this._ctx.drawImage(this.tileSheet.img,
        ...this.tileSheet.indexToXYWH(texIdx),
        ...this.indexToCvsXYWH(i, c))
    }
  }

  drawPlayer(x, y, w, h, spriteSheet, tick = 0) {
    const framesPerState = 20
    const numStates = spriteSheet.numSprites
    const animState = Math.floor(tick / framesPerState) % numStates
    this._ctx.drawImage(spriteSheet.img,
      ...spriteSheet.indexToXYWH(animState),
      ...this.xywhToCvsXYWH(x, y, w, h))
  }

  randN() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  resize(modelW, modelH, screenW, screenH) {
    this._w = this._cvs.width = modelW * this.tileSheet.spriteSize
    this._h = this._cvs.height = modelH * this.tileSheet.spriteSize
    this._cvs.style.width = `${screenW}px`
    this._cvs.style.height = `${screenH}px`
  }
}

class SpriteSheet {
  constructor(img, spriteSize) {
    this.img = img
    this._spriteSize = spriteSize
    if (img.naturalWidth % spriteSize != 0) {
      console.log(`bad tile sheet width: ${tileSheet.naturalWidth} % ${spriteSize} != 0`)
    }
    if (img.naturalHeight % spriteSize != 0) {
      console.log(`bad tile sheet height: ${tileSheet.naturalHeight} % ${spriteSize} != 0`)
    }
  }

  get numColumns() {
    return this.img.naturalWidth / this._spriteSize
  }

  get numRows() {
    return this.img.naturalHeight / this._spriteSize
  }

  get numSprites() {
    return this.numRows * this.numColumns
  }

  get spriteSize() {
    return this._spriteSize
  }

  indexToXYWH(idx) {
    return [
      idx % this.numColumns,
      Math.floor(idx / this.numColumns),
      1,
      1
    ].map(_ => _ * this.spriteSize)
  }
}

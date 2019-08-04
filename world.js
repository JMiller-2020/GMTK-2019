'use strict';

class World {
  constructor(level) {
    this._textures = level.textures
    this._collisions = level.collisions
    this._columns = level.numColumns
    if(this.numTiles % this.numColumns != 0) {
      console.log(`bad level shape: ${this.numTiles} % ${this.numColumns} != 0`)
    }
  }

  get textures() {
    return this._textures
  }

  get numColumns() {
    return this._columns
  }

  get numRows() {
    return this.numTiles / this.numColumns
  }

  get numTiles() {
    return this._textures.length
  }

  tileAt(x, y) {
    const tileIdx = y * this.numColumns + x
    const texId = this._textures[tileIdx]
    const collisionMask = this._collisions[tileIdx]
    return {
      texId,
      collisionMask,
      left: x,
      right: x + 1,
      top: y,
      bottom: y + 1
    }
  }
}
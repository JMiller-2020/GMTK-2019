'use strict';

class World {
  constructor() {

  }

  setup(level) {
    this._tiles = level.tiles
    this._columns = level.numColumns
    if(this.numTiles % this.numColumns != 0) {
      console.log(`corrupt level: ${this.numTiles} / ${this.numColumns} != 0`)
    }
  }

  get tiles() {
    return this._tiles
  }

  get numColumns() {
    return this._columns
  }

  get numRows() {
    return this.numTiles / this.numColumns
  }

  get numTiles() {
    return this._tiles.length
  }

  tileAt(x, y) {
    return {
      solid: !!this._tiles[y * this.numColumns + x],
      left: x,
      right: x + 1,
      top: y,
      bottom: y + 1
    }
  }

  setTileDict(tileDict) {
    this._tileDict = tileDict
  }
}
'use strict';

class World {
  constructor() {

  }

  setup(level) {
    this._tiles = level.tiles
    this._columns = level.columns
  }

  get tiles() {
    return this._tiles
  }

  get columns() {
    return this._columns
  }

  tileAt(x, y) {
    return {
      solid: !!this._tiles[y * this._columns + x],
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
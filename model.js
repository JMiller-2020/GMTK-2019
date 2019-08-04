'use strict';

class Model {
  constructor(w, h) {
    this.w = w
    this.h = h

    this.gravity = 0.4
    this.maxSpeed = 0.1

    this.player = new Player(2, 2, 0.8, 0.8)

    this.world = new World()
  }

  get ratio() {
    return this.w / this.h
  }

  setup(level) {
    this.world.setup(level)
    this.w = this.world.numColumns
    this.h = this.world.numRows
  }
}

class Player {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.lx = x
    this.ly = y
    this.acc = 0.02
    this.drag = 0.01
    this._collisionPoints = this.generateCollisionPoints()
  }

  collisionPoint(idx) {
    return [
      this._collisionPoints[idx][0] + this.x,
      this._collisionPoints[idx][1] + this.y
    ]
  }

  generateCollisionPoints() {
    const array = [
      [0, 0],
      [0, this.h],
      [this.w, 0]
    ]
    for(let i = 1; i < this.w; i++) {
      array.push([i, 0     ])  // along the top
      array.push([i, this.h])  // along the bottom
    }
    for(let j = 1; j < this.h; j++) {
      array.push([     0, j])  // along the left
      array.push([this.w, j])  // along the right
    }
    array.push([this.w, this.h])  // bottom right corner, jic
    return array
  }
}
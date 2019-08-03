'use strict';

class Model {
  constructor(w, h) {
    this.w = w
    this.h = h

    this.gravity = 0.4
    this.maxSpeed = 0.2

    this.player = new Player(2, 2, 0.8, 0.8)

    this.world = new World()
  }

  get ratio() {
    return this.w / this.h
  }
}

class Player {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.vx = 0
    this.vy = 0
    this.acc = 0.02
    this.drag = 0.01
  }

  collisionPoints() {
    const array = []
    for(let i = 0; i < this.w; i++) {
      array.push([this.x + i, this.y         ])  // along the top
      array.push([this.x + i, this.y + this.h])  // along the bottom
    }
    for(let j = 0; j < this.h; j++) {
      array.push([this.x,          this.y + j])  // along the left
      array.push([this.x + this.w, this.y + j])  // along the right
    }
    array.push([this.x + this.w, this.y + this.h])  // bottom right corner, jic
    return array
  }
}
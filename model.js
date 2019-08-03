'use strict';

class Model {
  constructor(w, h) {
    this.w = w
    this.h = h

    this.gravity = .4

    this.playerX = 2
    this.playerY = 2
    this.playerW = 2
    this.playerH = 3
    this.playerVX = 0
    this.playerVY = 0
  }

  get ratio() {
    return this.w / this.h
  }

  tick() {
    this.playerVY += this.gravity

    this.playerX += this.playerVX
    this.playerY += this.playerVY

    if(this.playerX < 0) {
      this.playerX = 0
      this.playerVX = Math.max(this.playerVX, 0)
    }
    if(this.playerX + this.playerW > this.w) {
      this.playerX = this.w - this.playerW
      this.playerVX = Math.min(this.playerVX, 0)
    }
    if(this.playerY < 0) {
      this.playerY = 0
      this.playerVY = Math.max(this.playerVY, 0)
    }
    if(this.playerY + this.playerH > this.h) {
      this.playerY = this.h - this.playerH
      this.playerVY = Math.min(this.playerVY, 0)
    }
  }
}
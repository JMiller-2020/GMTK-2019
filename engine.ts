'use strict';

class Engine {
  private tickLength: number
  private updateFunc
  private _running: boolean
  private accTime: number
  private tickCount: number
  private last: number
  private animFrame: number
  constructor(tickLength: number, updateFunc) {
    this.tickLength = tickLength
    this.updateFunc = updateFunc
    this._running = false
    this.accTime = 0
    this.tickCount = 0
    this.last = 0
  }

  get running() {
    return this._running
  }

  start() {
    this._running = true
    this.animFrame = requestAnimationFrame(this._tick.bind(this))
  }

  stop() {
    this._running = false
    cancelAnimationFrame(this.animFrame)
  }

  _tick(timestamp: number) {
    this.animFrame = requestAnimationFrame(this._tick.bind(this))
    const timeSince = timestamp - this.last
    this.last = timestamp
    this.accTime += timeSince
    if (this.accTime > 10 * this.tickLength) {
      console.log('lag', this.accTime)
      this.accTime = this.tickLength
    }
    while(this.accTime >= this.tickLength) {
      this.updateFunc(this.tickCount)
      this.tickCount++
      this.accTime -= this.tickLength
    }
  }
}
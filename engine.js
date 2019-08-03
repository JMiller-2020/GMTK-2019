'use strict';

class Engine {
  constructor(tickLength, updateFunc) {
    this._tickLength = tickLength
    this._updateFunc = updateFunc
    this._running = false
    this._accTime = 0
    this._tickCount = 0
  }

  start() {
    this._running = true
    this._last
    this._animFrame = requestAnimationFrame(this._tick.bind(this))
  }

  stop() {
    this._running = false
    cancelAnimationFrame(this._animFrame)
  }

  _tick(timeSince) {
    this._accTime += timeSince
    while(this._accTime > this._tickLength) {
      this._updateFunc(this._tickCount)
      this._tickCount++
      this._accTime -= this._tickLength
    }
    this._animFrame = requestAnimationFrame(this._tick.bind(this), this._tickLength)
  }
}
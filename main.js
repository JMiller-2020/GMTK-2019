'use strict';

var model, view, controller, engine
var canvas

const TICK_LENGTH = 1000 / 60
const FRAME_LENGTH = 1000 / 60

function main() {
  console.log('starting main.')

  engine.start()
  setTimeout(() => {
    engine.stop()
  }, 10000)
}

function gameLoop(tickCount) {
  model.tick()
  
  view.clear()
  view.drawPlayer(
    model.playerX,
    model.playerY,
    model.playerW,
    model.playerH
  )
}

function handleResize() {
  const w = window.innerWidth
  const h = window.innerHeight
  view.resize(w, h)
  model.w = w
  model.h = h
}

function init() {

  canvas = document.getElementById('game-canvas')

  model      = new Model()
  view       = new View(canvas)
  controller = new Controller()
  engine     = new Engine(TICK_LENGTH, this.gameLoop)

  handleResize()
  addEventListener('resize', handleResize)

  console.log('initialized.')
  main()
}

window.onload = init
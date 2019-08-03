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
  let w = window.innerWidth
  let h = window.innerHeight
  const screenRatio = w / h
  if(w/h > model.ratio) {
    w = h * model.ratio
  } else {
    h = w / model.ratio
  }
  view.resize(w, h)
}

function init() {

  canvas = document.getElementById('game-canvas')

  model      = new Model(60, 40)
  view       = new View(canvas)
  controller = new Controller()
  engine     = new Engine(TICK_LENGTH, this.gameLoop)

  handleResize()
  addEventListener('resize', handleResize)

  // view.setBounds(0, 0, model.w, model.h)
  view.setBounds(0, 0, model.w, model.h)

  console.log('initialized.')
  main()
}

window.onload = init
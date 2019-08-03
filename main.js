'use strict';

var model, view, controller, engine
var canvas

const TICK_LENGTH = 1000 / 60
const FRAME_LENGTH = 1000 / 60

function main() {
  console.log('starting main.')

  engine.start()
}

function gameLoop(tickCount) {
  // console.log(tickCount)

  model.tick(controller.buttonMap)  // maybe use axes too?
  
  view.clear()
  view.drawWorld(model.world.tiles, model.world.columns)
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
  if(w / h > model.ratio) {
    w = h * model.ratio
  } else {
    h = w / model.ratio
  }
  view.resize(w, h)
}

function init() {

  canvas = document.getElementById('game-canvas')

  model      = new Model(18, 12)
  view       = new View(canvas)
  controller = new Controller()
  engine     = new Engine(TICK_LENGTH, this.gameLoop)

  handleResize()
  addEventListener('resize', handleResize)

  model.world.load(0)

  view.setBounds(0, 0, model.w, model.h)

  console.log('initialized.')
  main()
}

window.onload = init
'use strict';

var model, view, controller, engine;
var canvas;

const TICK_LENGTH = 1000 / 60

function main() {
  console.log('starting main.')

  // Model test
  console.log(model.value)
  model.increment()
  console.log(model.value)

  // View test
  view.render()

  // Controller test
  setTimeout(() => {
    console.log(controller.isMouseDown)
  }, 1000)

  // Engine test
  engine.start()
  setTimeout(() => {
    engine.stop()
  }, 100)
}

function gameLoop(tickCount) {
  console.log('update:', tickCount)
}

function init() {

  canvas = document.getElementById('game-canvas')

  model      = new Model()
  view       = new View(canvas)
  controller = new Controller()
  engine     = new Engine(TICK_LENGTH, this.gameLoop)

  console.log('initialized.')
  main()
}

window.onload = init
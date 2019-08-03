'use strict';

var model, view, controller, engine;
var canvas;

function _main() {

}

function _init() {
  console.log('initialized.')

  canvas = document.getElementById('game-canvas')

  model      = new Model()
  view       = new View(canvas)
  controller = new Controller()

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
}

window.onload = _init
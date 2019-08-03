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

  tick()  // maybe use axes too?
  
  view.clear()
  view.drawWorld(model.world.tiles, model.world.columns)
  view.drawPlayer(
    model.playerX,
    model.playerY,
    model.playerW,
    model.playerH
  )
}

function tick() {
  const buttonMap = controller.buttonMap
  if('up' in buttonMap && buttonMap['up']) {
    model.player.vy -= model.player.acc
  }
  if('down' in buttonMap && buttonMap['down']) {
    model.player.vy += model.player.acc
  }
  if('left' in buttonMap && buttonMap['left']) {
    model.player.vx -= model.player.acc
  }
  if('right' in buttonMap && buttonMap['right']) {
    model.player.vx += model.player.acc
  }
  if('jump' in buttonMap && buttonMap['jump']) {
    // TODO
  }

  const unlimitedSpeed = Math.sqrt(model.player.vx * model.player.vx + model.player.vy * model.player.vy)
  if(unlimitedSpeed != 0) {
    let speed = unlimitedSpeed - model.player.drag
    if(speed < 0) {
      speed = 0
    } else if(speed > model.player.MaxSpeed) {
      speed = model.player.MaxSpeed
    }
    model.player.vx = speed * model.player.vx / unlimitedSpeed
    model.player.vy = speed * model.player.vy / unlimitedSpeed
  }

  // add gravity after limiting speed
  // and jump? Not quite enjoyable yet.
  // model.player.vy += model.gravity

  model.player.X += model.player.vx
  model.player.Y += model.player.vy

  // window collisions
  if(model.player.X < 0) {
    model.player.X = 0
    model.player.vx = Math.max(model.player.vx, 0)
  }
  if(model.player.X + model.player.W > model.w) {
    model.player.X = model.w - model.player.W
    model.player.vx = Math.min(model.player.vx, 0)
  }
  if(model.player.Y < 0) {
    model.player.Y = 0
    model.player.vy = Math.max(model.player.vy, 0)
  }
  if(model.player.Y + model.player.H > model.h) {
    model.player.Y = model.h - model.player.H
    model.player.vy = Math.min(model.player.vy, 0)
  }
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
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
    model.player.x,
    model.player.y,
    model.player.w,
    model.player.h
  )
}

function tick() {
  const buttonMap = controller.buttonMap
  let vector = [0, 0]
  if('up' in buttonMap && buttonMap['up']) {
    vector[1] -= 1
  }
  if('down' in buttonMap && buttonMap['down']) {
    vector[1] += 1
  }
  if('left' in buttonMap && buttonMap['left']) {
    vector[0] -= 1
  }
  if('right' in buttonMap && buttonMap['right']) {
    vector[0] += 1
  }
  const unlimitedAcc = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  if(unlimitedAcc != 0) {
    model.player.vx += vector[0] / unlimitedAcc * model.player.acc
    model.player.vy += vector[1] / unlimitedAcc * model.player.acc
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

  model.player.x += model.player.vx
  model.player.y += model.player.vy

  // world collisions
  for(let i = 0; i < model.player._collisionPoints.length; i++) {
    const point = model.player.collisionPoint(i)
    const loc = point.map(Math.floor)
    // console.log(model.world.tileAt(...loc))
    if(model.world.tileAt(...loc).collide) {
      console.log('collide', loc)
    }
  }

  // window collisions
  if(model.player.x < 0) {
    model.player.x = 0
    model.player.vx = Math.max(model.player.vx, 0)
  }
  if(model.player.x + model.player.w > model.w) {
    model.player.x = model.w - model.player.w
    model.player.vx = Math.min(model.player.vx, 0)
  }
  if(model.player.y < 0) {
    model.player.y = 0
    model.player.vy = Math.max(model.player.vy, 0)
  }
  if(model.player.y + model.player.h > model.h) {
    model.player.y = model.h - model.player.h
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
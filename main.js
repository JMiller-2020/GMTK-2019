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
  const player = model.player
  let vx = player.x - player.lx
  let vy = player.y - player.ly
  let vector = [0, 0]
  if ('up' in buttonMap && buttonMap['up']) {
    vector[1] -= 1
  }
  if ('down' in buttonMap && buttonMap['down']) {
    vector[1] += 1
  }
  if ('left' in buttonMap && buttonMap['left']) {
    vector[0] -= 1
  }
  if ('right' in buttonMap && buttonMap['right']) {
    vector[0] += 1
  }
  const unlimitedAcc = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  if (unlimitedAcc != 0) {
    vx += vector[0] / unlimitedAcc * player.acc
    vy += vector[1] / unlimitedAcc * player.acc
  }
  if ('jump' in buttonMap && buttonMap['jump']) {
    // TODO
  }

  const unlimitedSpeed = Math.sqrt(vx * vx + vy * vy)
  if (unlimitedSpeed != 0) {
    let speed = unlimitedSpeed - player.drag
    if (speed < 0) {
      speed = 0
    } else if (speed > player.MaxSpeed) {
      speed = player.MaxSpeed
    }
    vx = speed * vx / unlimitedSpeed
    vy = speed * vy / unlimitedSpeed
  }

  // add gravity after limiting speed
  // and jump? Not quite enjoyable yet.
  // vy += model.gravity

  player.lx = player.x
  player.ly = player.y
  player.x += vx
  player.y += vy

  // world collisions
  // TODO make tiles only collide with certain faces
  for (let i = 0; i < player._collisionPoints.length; i++) {
    let point = player.collisionPoint(i)
    const loc = point.map(Math.floor)
    const tile = model.world.tileAt(...loc)
    if (tile.solid &&
      player.y + player.h > tile.top &&
      player.y < tile.bottom &&
      player.x + player.w > tile.left &&
      player.x < tile.right) {
      if (vy > 0 && player.ly + player.h <= tile.top) {
        player.y = tile.top - player.h
      }
      if (vy < 0 && player.ly >= tile.bottom) {
        player.y = tile.bottom
      }
      if (vx > 0 && player.lx + player.w <= tile.left) {
        player.x = tile.left - player.w
      }
      if (vx < 0 && player.lx >= tile.right) {
        player.x = tile.right
      }
    }
  }

  // window collisions
  if (player.x < 0) {
    player.x = 0
  }
  if (player.x + player.w > model.w) {
    player.x = model.w - player.w
  }
  if (player.y < 0) {
    player.y = 0
  }
  if (player.y + player.h > model.h) {
    player.y = model.h - player.h
  }
}

function handleResize() {
  let w = window.innerWidth
  let h = window.innerHeight
  if (w / h > model.ratio) {
    w = h * model.ratio
  } else {
    h = w / model.ratio
  }
  view.resize(w, h)
}

async function init() {

  canvas = document.getElementById('game-canvas')

  model = new Model(18, 12)
  view = new View(canvas)
  controller = new Controller()
  engine = new Engine(TICK_LENGTH, this.gameLoop)

  handleResize()
  addEventListener('resize', handleResize)

  const tileDict = await fetch('tiles.json').then(json => json.json())
  model.world.setTileDict(tileDict)
  const level = await fetch('levels/00.json').then(json => json.json())
  model.setup(level)

  view.setBounds(0, 0, model.w, model.h)

  console.log('initialized.')
  main()
}

window.onload = init
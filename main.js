'use strict';

var model, view, controller, engine
var canvas
var playerSpriteSheet, collectableSpriteSheet
var dialogBox
var backgroundImage
var models = []
var dialogueQueue = []
var collectableCount = 0
var audio, isMuted = false

const TICK_LENGTH = 1000 / 60
const FRAME_LENGTH = 1000 / 60

function main() {
  console.log('starting main.')

  engine.start()

  // for debugging

  // setTimeout(() => {
  //   engine.stop()
  // }, 10000);
}

function gameLoop(tickCount) {
  // console.log(tickCount)

  captureCollectables()
  updatePlayer()
  model.entities.forEach(entity => updateEntity(entity))

  view.clear()
  // TODO draw background here
  view.drawBackground(backgroundImage)

  view.drawWorld(model.world.textures, model.world.numColumns)
  // draw collectables
  model.entities.forEach(entity => {
    view.drawEntity(
      entity.x,
      entity.y,
      entity.w,
      entity.h,
      collectableSpriteSheet,
      tickCount,
      10
    )
  })
  // draw player
  view.drawEntity(
    model.player.x,
    model.player.y,
    model.player.w,
    model.player.h,
    playerSpriteSheet,
    tickCount
  )
  // draw HUD
  view.drawHUD(
    collectableCount,
    isMuted
  )
  // draw dialog
  while(dialogueQueue.length > 0) {
    const dialogue = dialogueQueue[0]
    if(!dialogue.start) {
      dialogue.start = tickCount
    }
    if(dialogue.start + dialogue.duration > tickCount) {
      if(model.w >= 18) {
        view.drawDialogue(dialogBox, dialogueQueue[0].text)
      } else {
        dialogue.start++
      }
      break
    }
    dialogueQueue.shift()
  }
}

// TODO don't love how this works rn, not super flexible
function captureCollectables() {
  model.entities.forEach((entity, idx) => {
    const dx = model.player.cx - entity.cx
    const dy = model.player.cy - entity.cy
    const dist2 = dx * dx + dy * dy
    if (dist2 < 0.5) {
      model.entities.splice(idx, 1)
      collectableCount++
    }
  })
}

function updatePlayer() {
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
  if (vector[0] == 0 && vector[1] == 0) {
    vector = [Util.randN() / 256, Util.randN() / 256]
  }
  const unlimitedAcc = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  if (unlimitedAcc > player.acc) {
    vx += vector[0] / unlimitedAcc * player.acc
    vy += vector[1] / unlimitedAcc * player.acc
  }
  if ('jump' in buttonMap && buttonMap['jump'] && player.isGrounded) {
    vy -= player.jumpSpeed
  }
  player.isGrounded = false

  const unlimitedSpeed = Math.sqrt(vx * vx + vy * vy)
  if (unlimitedSpeed != 0) {
    let speed = unlimitedSpeed
    if (speed > player.minDragSpeed) {
      speed = unlimitedSpeed - player.drag
    }
    if (speed < 0) {
      speed = 0
    } else if (speed > player.maxSpeed) {
      speed = player.maxSpeed
    }
    vx = speed * vx / unlimitedSpeed
    vy = speed * vy / unlimitedSpeed
  }

  // add gravity after limiting speed
  // and jump? Not quite enjoyable yet.
  vy += model.gravity

  player.lx = player.x
  player.ly = player.y
  player.x += vx
  player.y += vy

  worldCollisions(player)
  checkDoors()
}

function checkDoors() {
  let point = [model.player.cx, model.player.cy]
  const loc = point.map(Math.floor)
  model.doors.forEach(door => {
    door.locations.forEach(doorLoc => {
      if (loc[0] == doorLoc[0] && loc[1] == doorLoc[1]) {
        engine.stop()
        const lastModel = model
        let promise
        if(models[door.to]) {
          promise = new Promise((res) => {
            model = models[door.to]
            res()
          })
        } else {
          promise = loadLevel(door.to)
        }
        Promise.all([promise]).then(() =>{
          view.setBounds(0, 0, model.w, model.h)
          handleResize()
          model.player.x = lastModel.player.x + door.relativePos[0]
          model.player.y = lastModel.player.y + door.relativePos[1]
          model.player.lx = lastModel.player.lx + door.relativePos[0]
          model.player.ly = lastModel.player.ly + door.relativePos[1]
          engine.start()
        })
      }
    })
  })
}

function updateEntity(entity) {
  let vx = entity.x - entity.lx
  let vy = entity.y - entity.ly
  let vector = [Util.randN(), Util.randN()]
  const unlimitedAcc = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
  if (unlimitedAcc != 0) {
    vx += vector[0] / unlimitedAcc * entity.acc
    vy += vector[1] / unlimitedAcc * entity.acc
  }

  // the rest is deterministic
  const unlimitedSpeed = Math.sqrt(vx * vx + vy * vy)
  if (unlimitedSpeed != 0) {
    let speed = unlimitedSpeed
    if (speed > entity.minDragSpeed) {
      speed = unlimitedSpeed - entity.drag
    }
    if (speed < 0) {
      speed = 0
    } else if (speed > entity.maxSpeed) {
      speed = entity.maxSpeed
    }
    vx = speed * vx / unlimitedSpeed
    vy = speed * vy / unlimitedSpeed
  }

  // add gravity after limiting speed
  // and jump? Not quite enjoyable yet.
  vy += model.gravity

  entity.lx = entity.x
  entity.ly = entity.y
  entity.x += vx
  entity.y += vy

  worldCollisions(entity)
  windowCollisions(entity)
}

function worldCollisions(entity) {
  for (let i = 0; i < entity._collisionPoints.length; i++) {
    let point = entity.collisionPoint(i)
    const loc = point.map(Math.floor)
    const tile = model.world.tileAt(...loc)
    if (tile.collisionMask &&
      entity.y + entity.h > tile.top &&
      entity.y < tile.bottom &&
      entity.x + entity.w > tile.left &&
      entity.x < tile.right) {
      if ((tile.collisionMask & 0b0001) && entity.ly + entity.h <= tile.top) {
        entity.y = tile.top - entity.h
        entity.isGrounded = true
      }
      if ((tile.collisionMask & 0b0010) && entity.lx >= tile.right) {
        entity.x = tile.right
      }
      if ((tile.collisionMask & 0b0100) && entity.ly >= tile.bottom) {
        entity.y = tile.bottom
      }
      if ((tile.collisionMask & 0b1000) && entity.lx + entity.w <= tile.left) {
        entity.x = tile.left - entity.w
      }
    }
  }
}

function windowCollisions(entity) {
  if (entity.x < 0) {
    entity.x = 0
  }
  if (entity.x + entity.w > model.w) {
    entity.x = model.w - entity.w
  }
  if (entity.y < 0) {
    entity.y = 0
  }
  if (entity.y + entity.h > model.h) {
    entity.y = model.h - entity.h
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
  view.resize(model.w, model.h, w, h)
}

function loadImage(url) {
  return new Promise((res) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = () => new Error(`Failed to load image at: ${url}`)
    img.src = url
  })
}

function loadLevel(levelId) {
  return fetch(Util.levelPath(levelId))
      .then(json => json.json())
      .then(level => {
        model = new Model(level)
        models[levelId] = model
        if(level.dialogue) {
          dialogueQueue.push(...level.dialogue)
        }
      })
}

async function init() {

  canvas = document.getElementById('game-canvas')

  view = new View(canvas)
  controller = new Controller()
  engine = new Engine(TICK_LENGTH, this.gameLoop)

  audio = document.getElementById('game-music')
  canvas.addEventListener('click', e => {
    if(e.offsetX < 120 && e.offsetY < 36) {
      if(isMuted) {
        audio.play()
        isMuted = false
      } else {
        audio.pause()
        isMuted = true
      }
    }
  })

  // retrieve resources
  await Promise.all([
    loadLevel(0),
    loadImage('img/tilesheet-0.0.4.png')
      .then(tileSheet => view.setTileSheet(tileSheet, 16)),
    loadImage('img/player-0.0.3.png')
      .then(img => playerSpriteSheet = new SpriteSheet(img, 16)),
    loadImage('img/collectable-0.0.1.png')
      .then(img => collectableSpriteSheet = new SpriteSheet(img, 8)),
    loadImage('img/dialogue-0.0.1.png')
      .then(img => dialogBox = new DialogBox(img)),
    loadImage('img/backgroundImage.png')
      .then(img => backgroundImage = img)
  ])

  handleResize()
  addEventListener('resize', handleResize)

  view.setBounds(0, 0, model.w, model.h)

  console.log('initialized.')
  main()
}

window.onload = init

class Util {
  static randN() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  static levelPath(id) {
    return `levels/${id.toString().padStart(2, '0')}.json`
  }
}

class DialogBox {
  constructor(img) {
    this.img = img
    this.x = 0
    this.y = 0
    this.textX = 144
    this.textY = 12
    this.w = 268
    this.textH = 10
    this.center = true
  }
}
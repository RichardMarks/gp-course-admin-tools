const SCREEN_WIDTH = {{screenWidth}}
const SCREEN_HEIGHT = {{screenHeight}}

const game = {
  canvas: undefined,

  init () {

  },

  update (deltaTime) {

  },

  render (renderingContext) {
    const ctx = renderingContext

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    ctx.fillText('This is my Game', SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5)

    ctx.strokeRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
  }
}

const boot = () => {
  console.clear()
  game.canvas = document.querySelector('.game-canvas')
  const renderingContext = game.canvas.getContext('2d')
  renderingContext.textAlign = 'center'
  renderingContext.textBaseline = 'middle'
  renderingContext.font = '16px "Kelly Slab"'
  renderingContext.fillStyle = 'lime'
  renderingContext.strokeStyle = 'lime'

  game.init && game.init()

  let lastTime = Date.now()
  const mainLoop = elapsedTime => {
    const currentTime = Date.now()
    const deltaTime = (currentTime - lastTime) * 0.001
    lastTime = currentTime
    game.update && game.update(deltaTime)
    game.render && game.render(renderingContext)
    window.requestAnimationFrame(mainLoop)
  }

  mainLoop(0)
}

document.addEventListener('DOMContentLoaded', boot, false)

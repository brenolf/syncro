import Rectangle from '../objects/Rectangle'

const GAME = require('../../json/game.json')

const MAIN = {
  border: GAME.active.border,
  trail: GAME.active.trails
}

const DEACTIVATED = {
  border: GAME.deactivated.border,
  trail: GAME.deactivated.trails
}

export default class Maze {
  constructor (context) {
    this.context = context

    this.paddles = {
      R: context.game.add.group(),
      L: context.game.add.group()
    }

    this.last = {
      R: null,
      L: null
    }

    this._populate()
    this._populate(false)
  }

  _populate (first = true) {
    const j = first ? 0 : 1

    const PADDLE = first ? 'L' : 'R'

    for (let i = 0; i < 30; i++) {
      const SIDE_DIE = Math.random()

      const PLUS = Math.floor(Math.random() * 170) + 100

      const BASE = (this.last[PADDLE] === null) ? 0 : this.last[PADDLE].y

      const T = BASE -
                PLUS +
                Math.floor(Math.random() * Math.min(this.context.ELAPSED, 30))

      const W = 50 +
                Math.floor(Math.random() * 50) +
                Math.floor(Math.random() * Math.min(this.context.ELAPSED, 30))

      const L = this.context.rails[j].LB.x +
                this.context.rails[j].LB.width / 2 +
                ((SIDE_DIE < 0.5) ? 50 : (this.context.rails[j].T.width - 50)) +
                ((SIDE_DIE < 0.5) ? (100 - W) : (W - 100))

      const color = this.context.rails[j].LB.color

      const data = [W, 10, L, T]

      const paddle = new Rectangle(this.context, color, ...data)

      this.context.game.physics.arcade.enable(paddle)

      paddle.checkWorldBounds = true

      paddle.body.immovable = true

      paddle._visible = T >= 0

      paddle.events.onOutOfBounds.add(this.vanished, paddle)
      paddle.events.onEnterBounds.add(this.appeared, paddle)

      this.paddles[PADDLE].addChild(paddle)

      this.last[PADDLE] = paddle

      if (i === 28 && first) {
        paddle._populate = this._populate
      }
    }
  }

  fall () {
    this.paddles.L.setAll('body.velocity.y', this.context.VELOCITY)
    this.paddles.R.setAll('body.velocity.y', this.context.VELOCITY)
  }

  swap () {
    ['L', 'R'].forEach(side => {
      this.paddles[side].children.forEach(paddle => {
        let color = MAIN

        if (side === 'L' && this.context.main === 1) {
          color = DEACTIVATED
        }

        if (side === 'R' && this.context.main === 0) {
          color = DEACTIVATED
        }

        paddle.recolorShape(color.border)
      })
    })
  }

  update () {
    this.fall()

    for (let i = 0; i < 2; i++) {
      const CHILDREN = this.paddles[i === 0 ? 'L' : 'R'].children

      const LEN = CHILDREN.length

      for (let j = 0; j < LEN; j++) {
        this.context.game.physics.arcade.collide(
          this.context.players[i],
          CHILDREN[j],
          this.context.players[i].hit,
          null,
          this.context.players[i]
        )
      }
    }
  }

  // paddle is the context
  appeared () {
    this._visible = true

    if (this._populate) {
      this._populate()
      this._populate(false)
    }
  }

  // paddle is the context
  vanished () {
    if (!this.inCamera && this._visible) {
      this.kill()
      this.destroy()
    }
  }
}

import Input from './Input'

const GAME = require('../../json/game.json')

const VELOCITY = 100

export default class World {
  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.input = new Input(this)
  }

  update () {
    this.players.forEach(player => {
      player.body.velocity.x = 0
    })

    this.input.update()
  }

  pause () {
  }

  resume () {
  }

  on_left_down () {
    this.players.forEach(player => {
      player.body.velocity.x = player.active ? -VELOCITY : 0
    })
  }

  on_right_down () {
    this.players.forEach(player => {
      player.body.velocity.x = player.active ? VELOCITY : 0
    })
  }

  on_spacebar_down () {
    this.players.forEach(player => {
      player.swap()
    })

    this.rails.forEach(rail => {
      rail.swap()
    })
  }
}

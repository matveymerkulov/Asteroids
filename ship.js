import {bounds, messageLabel} from "./data/main.js"
import {loc, play} from "../Furca/src/system.js"
import {changeState, lives, shipLayer, State} from "./main.js"
import {createExplosion} from "./explosion.js"
import {Sprite} from "../Furca/src/sprite.js"
import {Cos} from "../Furca/src/function/cos.js"
import {LoopArea} from "../Furca/src/actions/sprite/loop_area.js"
import {Constraint} from "../Furca/src/constraint.js"
import {Point} from "../Furca/src/point.js"
import {AnimateOpacity} from "../Furca/src/actions/sprite/animate_opacity.js"
import {shipSettings} from "./data/ship.js"
import {AngularSprite} from "../Furca/src/angular_sprite.js"

export let shipSprite, gun, invulnerabilityAction, flameSprite

export function initShip() {
    shipSprite = AngularSprite.create(shipSettings.sprite, shipLayer)
    invulnerabilityAction = new AnimateOpacity(shipSprite, new Cos(0.2, 0.5, 0, 0.5))

    gun = new Point(1, 0)

    flameSprite = AngularSprite.create(shipSettings.flame, shipLayer)

    shipSprite.actions.push(
        new LoopArea(shipSprite, bounds),
        new Constraint(flameSprite, shipSprite),
        new Constraint(gun, shipSprite)
    )
}

export function destroyShip() {
    createExplosion(shipSprite, 2)
    shipLayer.hide()
    if(lives.value === 0) {
        messageLabel.show(loc("gameOver"))
        changeState(State.gameOver)
        play("game_over")
    } else {
        messageLabel.show(loc("pressEnter"))
        changeState(State.dead)
        play("death")
    }
}
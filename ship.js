import {bounds, mainSettings, messageLabel} from "./data/main.js"
import {loc, play, texture} from "../Furca/src/system.js"
import {changeState, lives, shipLayer, State} from "./main.js"
import {createExplosion} from "./explosion.js"
import {Sprite} from "../Furca/src/sprite.js"
import {Cos} from "../Furca/src/function/cos.js"
import {LoopArea} from "../Furca/src/actions/sprite/loop_area.js"
import {Constraint} from "../Furca/src/constraint.js"
import {project} from "../Furca/src/project.js"
import {ImageArray} from "../Furca/src/image_array.js"
import {Point} from "../Furca/src/point.js"
import {AnimateSize} from "../Furca/src/actions/sprite/animate_size.js"
import {AnimateOpacity} from "../Furca/src/actions/sprite/animate_opacity.js"
import {Animate} from "../Furca/src/actions/sprite/animate.js"
import {rad} from "../Furca/src/functions.js"
import {shipSettings} from "./data/ship.js"

export let shipSprite, gun, invulnerabilityAction, flameSprite

export function initShip() {
    shipSprite = Sprite.create(shipSettings.sprite, shipLayer)
    invulnerabilityAction = new AnimateOpacity(shipSprite, new Cos(0.2, 0.5, 0, 0.5))

    gun = new Point(1, 0)

    let flameImages = new ImageArray(texture.flame, 3, 3, 0.5, 1)
    flameSprite = new Sprite(flameImages.image(0), -0.6, 0
        , 1, 1, undefined, rad(-90))
    shipLayer.add(flameSprite)

    project.actions.push(
        new LoopArea(shipSprite, bounds),
        new Animate(flameSprite, flameImages, 16),
        new AnimateSize(flameSprite, new Cos(0.1, 0.1, 0, 0.95)),
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
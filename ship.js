import {bounds, messageLabel, registry} from "./registry.js"
import {loc, play} from "../lib/system.js"
import {changeState, lives, shipLayer, State} from "./main.js"
import {createExplosion} from "./explosion.js"
import {Sprite} from "../lib/sprite.js"
import {Cos} from "../lib/function/cos.js"
import {LoopArea} from "../lib/actions/sprite/loop_area.js"
import {Constraint} from "../lib/constraint.js"
import {project} from "../lib/project.js"
import {ImageArray} from "../lib/image_array.js"
import {Point} from "../lib/point.js"
import {AnimateSize} from "../lib/actions/sprite/animate_size.js"
import {AnimateOpacity} from "../lib/actions/sprite/animate_opacity.js"
import {Animate} from "../lib/actions/sprite/animate.js"
import {rad} from "../lib/functions.js"

export let shipSprite, gun, invulnerabilityAction, flameSprite

export function initShip(texture) {
    shipSprite = Sprite.createFromTemplate(registry.template.ship)
    invulnerabilityAction = new AnimateOpacity(shipSprite, new Cos(0.2, 0.5, 0, 0.5))
    shipLayer.add(shipSprite)

    gun = new Point(1, 0)

    let flameImages = new ImageArray(texture["flame"], 3, 3, 0.5, 1)
    flameSprite = Sprite.create(shipLayer, flameImages.image(0), -0.6, 0
        , 1, 1, undefined, rad(-90))

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
    shipSprite.setFromTemplate(registry.template.ship)
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
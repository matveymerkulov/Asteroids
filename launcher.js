import {currentState, State} from "./main.js"
import {Sprite} from "../lib/sprite.js"
import {registry} from "./registry.js"
import {play} from "../lib/system.js"
import {explosionDamage} from "./explosion.js"
import {destroyShip, gun, shipSprite} from "./ship.js"


export function initLauncher(texture) {

    // missile launcher

    let launcher = registry.template.weapon.launcher

    launcher.missile.parameters.onHit = function() {
        explosionDamage(this)
        if(this.collidesWithSprite(shipSprite)) {
            destroyShip()
        }
    }

    launcher.update = function() {
        if(currentState !== State.alive) return

        if(this.ammo.value > 0 && this.controller.active()) {
            let missile = Sprite.createFromTemplate(this.missile)
            missile.setPositionAs(gun)
            missile.turn(shipSprite.angle)
            this.ammo.decrement()
            play("fire_missile")
        }
    }

    launcher.collect = function() {
        this.ammo.increment(1, this.maxAmmo)
    }
}
import {currentState, currentWeapon, State} from "./main.js"
import {registry} from "./registry.js"
import {Sprite} from "../lib/sprite.js"
import {play} from "../lib/system.js"
import {gun, shipSprite} from "./ship.js"

export function initFireball() {
    let weapon = registry.template.weapon
    weapon.fireball.update = function() {
        if(currentWeapon !== this || currentState !== State.alive) return

        if(this.controller.active()) {
            let bullet = Sprite.createFromTemplate(weapon.fireball.bullet)
            bullet.setPositionAs(gun)
            bullet.turn(shipSprite.angle)
            play("fireball")
        }
    }
}
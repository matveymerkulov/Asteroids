import {bullets, currentState, currentWeapon, State} from "./main.js"
import {Sprite} from "../Furca/src/sprite.js"
import {play} from "../Furca/src/system.js"
import {gun, shipSprite} from "./ship.js"
import {mainSettings} from "./data/main.js"

export function initFireball() {
    let fireball = mainSettings.weapon.fireball
    fireball.update = function() {
        if(currentWeapon !== this || currentState !== State.alive) return

        if(fireball.controller.active()) {
            let bullet = Sprite.create(fireball.bullet, bullets)
            bullet.setPositionAs(gun)
            bullet.turn(shipSprite.angle)
            play("fireball")
        }
    }
}
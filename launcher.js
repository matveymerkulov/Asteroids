import {bullets, currentState, State} from "./main.js"
import {Sprite} from "../Furca/src/sprite.js"
import {play} from "../Furca/src/system.js"
import {explosionDamage} from "./explosion.js"
import {destroyShip, gun, shipSprite} from "./ship.js"
import {launcherSettings} from "./data/launcher.js"
import {AngularSprite} from "../Furca/src/angular_sprite.js"


export function initLauncher() {
    launcherSettings.missile.parameters.onHit = function() {
        explosionDamage(this)
        if(this.collidesWithSprite(shipSprite)) {
            destroyShip()
        }
    }

    launcherSettings.update = function() {
        if(currentState !== State.alive) return

        if(this.ammo.value > 0 && this.controller.active()) {
            let missile = AngularSprite.create(this.missile, bullets)
            missile.setPositionAs(gun)
            missile.turn(shipSprite.angle)
            this.ammo.decrement()
            play("fire_missile")
        }
    }

    launcherSettings.collect = function() {
        this.ammo.increment(1, this.maxAmmo)
    }
}
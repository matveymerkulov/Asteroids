import {bounds, mainSettings} from "./data/main.js"
import {Sprite} from "../Furca/src/sprite.js"
import {play} from "../Furca/src/system.js"
import {DelayedHide} from "../Furca/src/actions/sprite/delayed_hide.js"
import {bullets, currentState, currentWeapon, setCurrentWeapon, shipLayer, State} from "./main.js"
import {Constraint} from "../Furca/src/constraint.js"
import {project} from "../Furca/src/project.js"
import {RemoveIfOutside} from "../Furca/src/actions/sprite/remove_if_outside.js"
import {shipSprite} from "./ship.js"
import {AngularSprite} from "../Furca/src/angular_sprite.js"

export function initTurret() {
    let turret = mainSettings.weapon.turret

    const sprite = AngularSprite.create(turret.sprite, shipLayer)
    sprite.visible = false
    shipLayer.add(sprite)

    turret.gunfireSprites = []
    for (let i = 0; i <= 1; i++) {
        const gunfire = AngularSprite.create(turret.gunfire)
        gunfire.setPositionAs(shipSprite, 0.4, 0.4 - 0.8 * i)
        gunfire.hide()
        turret.gunfireSprites.push(gunfire)
        shipLayer.add(gunfire)
        project.actions.push(new Constraint(gunfire, sprite))
    }

    turret.collect = function() {
        setCurrentWeapon(this)
        this.ammo.increment(this.bonusAmmo, this.maxAmmo)
        sprite.visible = true
    }

    turret.update = function() {
        for (let i = 0; i <= 1; i++) {
            let gunfire = turret.gunfireSprites[i]
            gunfire.setAngleAs(shipSprite)
        }

        if(currentWeapon !== turret || currentState !== State.alive) return

        if(turret.controller.active()) {
            for (let i = 0; i <= 1; i++) {
                let gunfire = turret.gunfireSprites[i]
                gunfire.actions = [new DelayedHide(gunfire, turret.gunfireTime)]
                gunfire.show()

                let bullet = AngularSprite.create(turret.bullet, bullets)
                bullet.setPositionAs(gunfire)
                bullet.setAngleAs(shipSprite)
                bullet.onHit = () => {
                    play("bullet_hit")
                }
            }
            play("bullet")
            this.ammo.decrement()
            if(this.ammo.value === 0) {
                sprite.visible = false
                setCurrentWeapon(mainSettings.weapon.fireball)
            }
        }

        sprite.setPositionAs(shipSprite)
        sprite.angle = shipSprite.angle
    }

    project.actions.push(new RemoveIfOutside(bullets, bounds))
}



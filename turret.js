import {bounds, registry} from "./registry.js"
import {Sprite} from "../lib/sprite.js"
import {play} from "../lib/system.js"
import {DelayedHide} from "../lib/actions/sprite/delayed_hide.js"
import {bullets, currentState, currentWeapon, setCurrentWeapon, shipLayer, State} from "./main.js"
import {Constraint} from "../lib/constraint.js"
import {project} from "../lib/project.js"
import {RemoveIfOutside} from "../lib/actions/sprite/remove_if_outside.js"
import {shipSprite} from "./ship.js"

export function initTurret(texture) {
    let turret = registry.template.weapon.turret

    turret.collect = function() {
        setCurrentWeapon(this)
        this.ammo.increment(this.bonusAmmo, this.maxAmmo)
        this.sprite.visible = true
    }

    turret.update = function() {
        for (let i = 0; i <= 1; i++) {
            let gunfire = this.gunfire[i]
            gunfire.setPositionAs(this.barrelEnd[i])
            gunfire.setAngleAs(shipSprite)
        }

        if(currentWeapon !== this || currentState !== State.alive) return
        let sprite = this.sprite

        if(this.controller.active()) {
            for (let i = 0; i <= 1; i++) {
                let bullet = Sprite.createFromTemplate(this.bullet)
                bullet.setPositionAs(this.barrelEnd[i])
                bullet.setAngleAs(shipSprite)
                bullet.onHit = () => {
                    play("bullet_hit")
                }

                let gunfire = this.gunfire[i]
                gunfire.actions = [new DelayedHide(gunfire, this.gunfireTime)]
                gunfire.show()
            }
            play("bullet")
            this.ammo.decrement()
            if(this.ammo.value === 0) {
                sprite.visible = false
                setCurrentWeapon(registry.template.weapon.fireball)
            }
        }

        sprite.setPositionAs(shipSprite)
        sprite.angle = shipSprite.angle
    }

    turret.sprite.visible = false
    shipLayer.add(turret.sprite)

    project.actions.push(
        new Constraint(turret.barrelEnd[0], turret.sprite),
        new Constraint(turret.barrelEnd[1], turret.sprite),
        new RemoveIfOutside(bullets, bounds),
    )
}



import {num} from "../lib/system.js"
import {Sprite} from "../lib/sprite.js"
import {Cos} from "../lib/function/cos.js"
import {asteroids, bonuses, score} from "./main.js"
import {RotateImage} from "../lib/actions/sprite/rotate_image.js"
import {createExplosion, createSingleExplosion} from "./explosion.js"
import {registry} from "./registry.js"
import {AnimateSize} from "../lib/actions/sprite/animate_size.js"
import {AnimateAngle} from "../lib/actions/sprite/animate_angle.js"
import {rad, rnd} from "../lib/functions.js"


export function createAsteroid(type, angle = 0) {
    let asteroid = Sprite.createFromTemplate(type)
    asteroid.turn(angle)
    asteroid.type = type
    asteroid.imageAngle = 0
    asteroid.add(new RotateImage(asteroid, num(type.rotationSpeed)))
    return asteroid
}

export function removeAsteroid(asteroid) {
    score.increment(asteroid.type.score)
    asteroids.remove(asteroid)
}

export function onAsteroidHit(asteroid, bullet) {
    asteroid.hp -= bullet.damage
    if(asteroid.hp <= 0) destroyAsteroid(asteroid, bullet.angle)
    createSingleExplosion(bullet, bullet.explosionSize, false)
    if(bullet.onHit) bullet.onHit()
}

export function destroyAsteroid(asteroid, angle) {
    asteroid.type.pieces?.forEach(piece => {
        createAsteroid(piece.type, angle + rad(piece.angle)).setPositionAs(asteroid)
    })
    if(asteroid.onHit) asteroid.onHit()
    createExplosion(asteroid, asteroid.width)
    removeAsteroid(asteroid)

    // bonus

    for(let weapon of Object.values(registry.template.weapon)) {
        if(!weapon.bonus) continue
        if(rnd() > weapon.probability) continue

        let bonus = Sprite.createFromTemplate(weapon.bonus)
        bonus.weapon = weapon
        bonus.setPositionAs(asteroid)
        bonus.add(new AnimateSize(bonus, new Cos(0.45, 0.1, 0, 1)))
        bonus.add(new AnimateAngle(bonus, new Cos(0.9, rad(15))))
        bonuses.add(bonus)
        return
    }
}
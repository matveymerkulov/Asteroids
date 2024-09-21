import {num} from "../Furca/src/system.js"
import {Sprite} from "../Furca/src/sprite.js"
import {Cos} from "../Furca/src/function/cos.js"
import {bonuses, score} from "./main.js"
import {RotateImage} from "../Furca/src/actions/sprite/rotate_image.js"
import {createExplosion, createSingleExplosion} from "./explosion.js"
import {mainSettings} from "./data/main.js"
import {AnimateSize} from "../Furca/src/actions/sprite/animate_size.js"
import {AnimateAngle} from "../Furca/src/actions/sprite/animate_angle.js"
import {rad, rnd} from "../Furca/src/functions.js"
import {asteroids, asteroidSettings} from "./data/asteroids.js"


export function createAsteroid(type, angle = 0) {
    let asteroid = Sprite.create(type, asteroids)
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
        createAsteroid(asteroidSettings[piece.type], angle + rad(piece.angle)).setPositionAs(asteroid)
    })
    if(asteroid.onHit) asteroid.onHit()
    createExplosion(asteroid, asteroid.width)
    removeAsteroid(asteroid)

    // bonus

    for(let weapon of Object.values(mainSettings.weapon)) {
        let weaponBonus = weapon.bonus
        if(!weaponBonus) continue
        if(rnd() > weaponBonus.probability) continue

        let bonus = Sprite.create(weaponBonus, bonuses)
        bonus.weapon = weapon
        bonus.setPositionAs(asteroid)
        bonus.add(new AnimateSize(bonus, new Cos(0.45, 0.1, 0, 1)))
        bonus.add(new AnimateAngle(bonus, new Cos(0.9, rad(15))))
        return
    }
}
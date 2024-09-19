import {Sprite} from "../lib/sprite.js"
import {DelayedRemove} from "../lib/actions/sprite/delayed_remove.js"
import {ShapeType} from "../lib/shape.js"
import {asteroids, explosions} from "./main.js"
import {destroyAsteroid} from "./asteroid.js"
import {registry} from "./registry.js"
import {play} from "../lib/system.js"
import {cos, rad, rnd, rndi, sin} from "../lib/functions.js"


export function explosionDamage(sprite) {
    sprite.size = sprite.explosionSize
    let inExplosion = []
    sprite.collisionWith(asteroids, (mis, asteroid) => {
        inExplosion.push(asteroid)
    })
    inExplosion.forEach((asteroid) => {
        destroyAsteroid(asteroid, sprite.angleTo(asteroid.x, asteroid.y))
    })
}

export function createSingleExplosion(sprite, size, playSnd = true) {
    let explosion = Sprite.createFromTemplate(registry.template.explosion)
    explosion.size = size
    explosion.setPosition(sprite.x, sprite.y)
    explosion.add(new DelayedRemove(explosion, explosions, 1.0))
    if(playSnd) play("explosion")
}

export function createExplosion(sprite, size, playSnd = true) {
    let times = rndi(3) + size
    createParticle(true)
    if(playSnd) play("explosion")

    function createParticle(first) {
        let angle = rad(rnd(360))
        let length = first ? 0 : Math.sqrt(rnd(1))
        let particleSize = first ? size : (1 - length / 2) * size

        let explosion = Sprite.create(explosions, registry.template.explosion.images
            , sprite.x + length * cos(angle), sprite.y + length * sin(angle)
            , particleSize, particleSize, ShapeType.circle, rad(rnd(360)), 0, 16)
        explosion.add(new DelayedRemove(explosion, explosions, 1))
        times--
        if(times > 0) setTimeout(createParticle, 100)
    }
}
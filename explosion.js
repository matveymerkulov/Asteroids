import {Sprite} from "../Furca/src/sprite.js"
import {DelayedRemove} from "../Furca/src/actions/sprite/delayed_remove.js"
import {ShapeType} from "../Furca/src/shape.js"
import {explosions} from "./main.js"
import {destroyAsteroid} from "./asteroid.js"
import {play} from "../Furca/src/system.js"
import {cos, rad, rnd, rndi, sin} from "../Furca/src/functions.js"
import {mainSettings} from "./data/main.js"
import {asteroids} from "./data/asteroids.js"
import {project} from "../Furca/src/project.js"
import {ImageArray} from "../Furca/src/image_array.js"
import {Animate} from "../Furca/src/actions/sprite/animate.js"
import {AngularSprite} from "../Furca/src/angular_sprite.js"


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
    let explosion = AngularSprite.create(mainSettings.explosion, explosions)
    explosion.size = size
    explosion.setPosition(sprite.x, sprite.y)
    project.actions.push(new DelayedRemove(explosion, explosions, 1.0))
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

        let explosion = new Sprite(undefined
            , sprite.x + length * cos(angle), sprite.y + length * sin(angle)
            , particleSize, particleSize, ShapeType.circle, rad(rnd(360)), 0, 16)
        explosion.add(new Animate(explosion, ImageArray.create(mainSettings.explosion.images)
            , mainSettings.explosion.animationSpeed ))
        explosion.add(new DelayedRemove(explosion, explosions, 1))
        explosions.add(explosion)
        times--
        if(times > 0) setTimeout(createParticle, 100)
    }
}
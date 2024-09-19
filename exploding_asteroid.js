import {bounds, registry} from "./registry.js"
import {createAsteroid, removeAsteroid} from "./asteroid.js"
import {explosionDamage} from "./explosion.js"
import {destroyShip, shipSprite} from "./ship.js"
import {rnd} from "../lib/functions.js"


export function initExplodingAsteroid() {
    registry.template.explodingAsteroid.parameters.onHit = function() {
        removeAsteroid(this)
        explosionDamage(this)
        if(this.collidesWithSprite(shipSprite)) {
            destroyShip()
        }
    }
}

export function explodingAsteroidLevelInit(num) {
    for(let i = 1; i <= num; i += 5) {
        let asteroid = createAsteroid(registry.template.explodingAsteroid, rnd(360))
        asteroid.moveToPerimeter(bounds)
    }
}
import {bounds} from "./data/main.js"
import {createAsteroid, removeAsteroid} from "./asteroid.js"
import {explosionDamage} from "./explosion.js"
import {destroyShip, shipSprite} from "./ship.js"
import {rnd} from "../Furca/src/functions.js"
import {asteroidSettings} from "./data/asteroids.js"


export function initExplodingAsteroid() {
    asteroidSettings.exploding.parameters.onHit = function() {
        removeAsteroid(this)
        explosionDamage(this)
        if(this.collidesWithSprite(shipSprite)) {
            destroyShip()
        }
    }
}

export function explodingAsteroidLevelInit(num) {
    for(let i = 1; i <= num; i += 5) {
        if(i === 1) continue
        let asteroid = createAsteroid(asteroidSettings.exploding, rnd(360))
        asteroid.moveToPerimeter(bounds)
    }
}
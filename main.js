import {apsk, loc, loopedSound, paused, play, togglePause} from "../lib/system.js"
import {LinearChange} from "../lib/actions/linear_change.js"
import {project} from "../lib/project.js"
import {currentCanvas} from "../lib/canvas.js"
import {bounds, forward, hud, left, messageLabel, newGame, pause, registry, right,} from "./registry.js"
import {Move} from "../lib/actions/sprite/move.js"
import {Num} from "../lib/variable/number.js"
import {Layer} from "../lib/layer.js"
import {createAsteroid, destroyAsteroid, onAsteroidHit} from "./asteroid.js"
import {explodingAsteroidLevelInit} from "./exploding_asteroid.js"
import {destroyShip, flameSprite, invulnerabilityAction, shipSprite} from "./ship.js"
import {rad, rnd} from "../lib/functions.js"

// variables

export const score = new Num()
export const lives = new Num()
export const level = new Num()

// layers

export const bullets = new Layer()
export const shipLayer = new Layer()
export const asteroids = new Layer()
export const particles = new Layer()
export const bonuses = new Layer()
export const explosions = new Layer()

// assets

project.getAssets = () => {
    return {
        texture: [
            "textures/asteroid.png",
            "textures/bullet.png",
            "textures/empty_bonus.png",
            "textures/exploding_asteroid.png",
            "textures/explosion.png",
            "textures/fireball.png",
            "textures/flame.png",
            "textures/flame_particle.png",
            "textures/gunfire.png",
            "textures/missile.png",
            "textures/missile_bonus.png",
            "textures/missile_icon.png",
            "textures/ship.png",
            "textures/turret.png",
            "textures/turret_bonus.png",
            "textures/ammo_icon.png",
        ],
        sound: [
            "sounds/bonus.mp3",
            "sounds/bullet.mp3",
            "sounds/bullet_hit.mp3",
            "sounds/death.mp3",
            "sounds/explosion.mp3",
            "sounds/extra_life.mp3",
            "sounds/fire_missile.ogg",
            "sounds/fireball.mp3",
            "sounds/flame.mp3",
            "sounds/game_over.mp3",
            "sounds/music.mp3",
            "sounds/new_level.mp3",
        ]
    }
}

export const State = {
    alive: 0,
    dead: 1,
    gameOver: 2,
}

export let currentState = State.alive, currentWeapon, nextLifeBonus

export function changeState(newState) {
    currentState = newState
}

export function setCurrentWeapon(weapon) {
    currentWeapon = weapon
}

export function initUpdate() {
    let template = registry.template
    lives.value = registry.lives

    loopedSound("music", 0, 1.81, true)
    let flameSound = loopedSound("flame", 1.1, 1.9)

    // level

    function initLevel(num) {
        for(let i = 0; i < num; i++) {
            let asteroid = createAsteroid(template.asteroidType.big, rnd(rad(360)))
            asteroid.moveToPerimeter(bounds)
        }
        explodingAsteroidLevelInit(num)
        if(level > 1) score.increment(registry.levelBonus)
    }

    function reset() {
        lives.value = registry.lives
        score.value = 0
        asteroids.clear()
        level.value = 0
        nextLifeBonus = registry.lifeBonus
        currentWeapon = registry.startingWeapon
    }

    reset()

    // main

    let invTime = 0
    let invulnerable = false

    project.update = () => {
        if(pause.wasPressed) {
            togglePause()
            if(paused) {
                messageLabel.show(loc("paused"))
            } else {
                messageLabel.show()
            }
        }
        if(paused) return

        if(currentState === State.alive) {
            if(left.isDown) {
                LinearChange.execute(shipSprite, "angle", -rad(registry.shipAngularSpeed))
            }

            if(right.isDown) {
                LinearChange.execute(shipSprite, "angle", rad(registry.shipAngularSpeed))
            }

            if(forward.isDown) {
                LinearChange.execute(shipSprite,"speed", registry.shipAcceleration, 0
                    , registry.shipAccelerationLimit)
                // noinspection JSIgnoredPromiseFromCall
                flameSound?.play()
            } else {
                LinearChange.execute(shipSprite, "speed", -registry.shipDeceleration, 0)
                if(!flameSound.paused) flameSound.pause()
                flameSound.currentTime = 0
            }

            flameSprite.visible = forward.isDown

            if(!invulnerable) {
                shipSprite.collisionWith(asteroids, (sprite, asteroid) => {
                    destroyShip()
                    destroyAsteroid(asteroid, 0)
                })
            }
        } else if(newGame.wasPressed) {
            shipLayer.show()
            messageLabel.show()
            if(currentState === State.dead) {
                lives.decrement()
                invulnerable = true
                invTime = registry.invulnerabilityTime
            } else {
                reset()
            }
            currentState = State.alive
        } else {
            if(!flameSound.paused) flameSound.pause()
        }

        if(asteroids.isEmpty()) {
            level.increment()
            initLevel(level.value)
            play("new_level")
        }

        bullets.collisionWith(asteroids, (bullet, asteroid) => {
            onAsteroidHit(asteroid, bullet)
            bullets.remove(bullet)
        })

        // weapon

        for(const weapon of Object.values(template.weapon)) {
            weapon.update?.()
        }

        // asteroid bonus

        bonuses.collisionWith(shipSprite, function(bonus) {
            bonus.weapon.collect()
            play("bonus")
            bonuses.remove(bonus)
        })

        // extra life

        if(score.value >= nextLifeBonus) {
            lives.increment()
            play("extra_life")
            nextLifeBonus += nextLifeBonus
        }

        // camera

        currentCanvas.setPositionAs(shipSprite)
        bounds.setPositionAs(shipSprite)
        hud.setPositionAs(shipSprite)

        // invulnerability

        if(invulnerable) {
            invulnerabilityAction.execute()
            invTime -= apsk
            if(invTime <= 0) invulnerable = false
        }
    }

    project.scene.add(bullets, asteroids, bonuses, particles, shipLayer, explosions, hud)

    project.actions.push(new Move(project.scene))
}
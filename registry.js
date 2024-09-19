import {project} from "../lib/project.js"
import {Img} from "../lib/image.js"
import {Key} from "../lib/key.js"
import {Align, defaultCanvas, loc} from "../lib/system.js"
import {Box} from "../lib/box.js"
import {currentCanvas} from "../lib/canvas.js"
import {Label} from "../lib/gui/label.js"
import {Layer} from "../lib/layer.js"
import {asteroids, bullets, explosions, initUpdate, level, lives, score, shipLayer} from "./main.js"
import {initLauncher} from "./launcher.js"
import {initFireball} from "./fireball.js"
import {initTurret} from "./turret.js"

import {initExplodingAsteroid} from "./exploding_asteroid.js"
import {initShip} from "./ship.js"

import {ImageArray} from "../lib/image_array.js"
import {Rnd} from "../lib/function/rnd.js"
import {Mul} from "../lib/function/mul.js"
import {rnds} from "../lib/function/random_sign.js"
import {LoopArea} from "../lib/actions/sprite/loop_area.js"
import {Turbo} from "./turbo.js"
import {Sprite} from "../lib/sprite.js"
import {Point} from "../lib/point.js"
import {Num} from "../lib/variable/number.js"

export let registry

export let left = new Key("ArrowLeft")
export let right = new Key("ArrowRight")
export let forward = new Key("ArrowUp")
export let newGame = new Key("Enter")
export let pause = new Key("KeyP")
export let fire = new Key("Space")
export let fireMissile = new Key("KeyX")

export let messageLabel, hud, bounds

project.init = (texture) => {
    let asteroidImages = new ImageArray(texture["asteroid"], 8, 4
        , 0.5, 0.5, 1.5, 1.5)

    let gunfire = {
        layer: shipLayer,
        image: new Img(texture["gunfire"], undefined, undefined, undefined, undefined, 0, 0.5),
        size: 1,
        visible: false,
    }

    registry = {
        lives: 3,
        startingLives: 3,
        shipAcceleration: 25,
        shipDeceleration: 15,
        shipAccelerationLimit: 7.5,
        shipAngularSpeed: 180,
        lifeBonus: 25000,
        levelBonus: 1000,
        invulnerabilityTime: 2,

        template: {
            gunfire: gunfire,

            ship: {
                image: new Img(texture["ship"], 0, 0, undefined, undefined
                    , 0.5, 0.5, 1.75, 1.75),
                angle: 0,
                speed: 0,
            },

            explosion: {
                layer: explosions,
                images: new ImageArray(texture["explosion"], 4, 4, 0.5, 0.5, 2, 2),
                angle: new Rnd(360),
                animationSpeed: 16
            },

            asteroidType: {
                big: {
                    layer: asteroids,
                    images: asteroidImages,
                    size: 3,
                    angle: new Rnd(-15, 15),
                    speed: new Rnd(2, 3),
                    animationSpeed: new Mul(new Rnd(12, 20), rnds),
                    rotationSpeed: new Rnd(-180, 180),
                    score: 100,
                    parameters: {
                        hp: 300,
                    }
                },

                medium: {
                    layer: asteroids,
                    images: asteroidImages,
                    size: 2,
                    angle: new Rnd(-15, 15),
                    speed: new Rnd(2.5, 4),
                    animationSpeed: new Mul(new Rnd(16, 25), rnds),
                    rotationSpeed: new Rnd(-180, 180),
                    score: 200,
                    parameters: {
                        hp: 200,
                    }
                },

                small: {
                    layer: asteroids,
                    images: asteroidImages,
                    size: 1,
                    angle: new Rnd(-15, 15),
                    speed: new Rnd(3, 5),
                    animationSpeed: new Mul(new Rnd(20, 30), rnds),
                    rotationSpeed: new Rnd(-180, 180),
                    score: 300,
                    parameters: {
                        hp: 100,
                    },
                },
            },

            explodingAsteroid: {
                layer: asteroids,
                images: new ImageArray(texture["exploding_asteroid"], 8, 4
                    , 0.5, 0.5, 1.5, 1.5),
                size: 2,
                speed: 5,
                //angle: new Rnd(rad(-10), rad(10)),
                animationSpeed: 24.0,
                score: 250,
                parameters: {
                    explosionSize: 5,
                    hp: 50,
                }
            },

            weapon: {
                fireball: {
                    bullet: {
                        layer: bullets,
                        images: new ImageArray(texture["fireball"], 1, 16
                            , 43 / 48, 5.5 / 12, 5.25, 1.5),
                        size: 0.3,
                        speed: 15,
                        //angle: new Rnd(rad(-10), rad(10)),
                        animationSpeed: 16.0,
                        parameters: {
                            damage: 100,
                            explosionSize: 0.8,
                        },
                    },
                    controller: new Turbo(fire, 0.15),
                },

                turret: {
                    sprite: new Sprite(new Img(texture["turret"]), 0, 0, 2, 2),
                    barrelEnd: [new Point(0.5, 0.4), new Point(0.5, -0.4)],
                    gunfire: [Sprite.createFromTemplate(gunfire)
                        , Sprite.createFromTemplate(gunfire)],
                    controller: new Turbo(fire, 0.10),

                    bullet: {
                        layer: bullets,
                        image: new Img(texture["bullet"]),
                        size: 0.12,
                        speed: 30,
                        parameters: {
                            damage: 50,
                            explosionSize: 0.5,
                        }
                    },

                    bonus: new Sprite(new Img(texture["turret_bonus"])),

                    probability: 0.1,
                    ammo: new Num(),
                    bonusAmmo: 50,
                    maxAmmo: 100,
                    gunfireTime: 0.05
                },

                launcher: {
                    missile: {
                        class: "template",
                        layer: bullets,
                        image: new Img(texture["missile"], undefined, undefined, undefined, undefined
                            , 0.95, 0.5, 10, 3),
                        size: 0.15,
                        speed: 15,
                        parameters: {
                            damage: 300,
                            explosionSize: 5,
                        },
                    },

                    bonus: new Sprite(new Img(texture["missile_bonus"])),
                    probability: 0.1,
                    ammo: new Num(3),
                    maxAmmo: 8,
                    controller: new Turbo(fireMissile, 0.5),
                }

            }
        }
    }


    let type = registry.template.asteroidType
    type.big.pieces = [
        {
            type: type.medium,
            angle: 0,
        }, {
            type: type.small,
            angle: 60,
        }, {
            type: type.small,
            angle: -60,
        },
    ]

    type.medium.pieces = [
        {
            type: type.small,
            angle: 60,
        }, {
            type: type.small,
            angle: -60,
        },
    ]

    type.small.pieces = []

    defaultCanvas(20, 20)

    bounds = new Box(0, 0, currentCanvas.width + 3, currentCanvas.height + 3)
    project.actions.push(
        new LoopArea(asteroids, bounds)
    )

    initShip(texture)
    initExplodingAsteroid(texture)

    initFireball(texture)
    initTurret(texture)
    initLauncher(texture)

    let weapon = registry.template.weapon
    registry.startingWeapon = weapon.fireball

    // gui

    let hudArea = new Box(0, 0, currentCanvas.width - 1, currentCanvas.height - 1)

    let scoreLabel = new Label(hudArea, [score], Align.left, Align.top, "Z8")
    let levelLabel = new Label(hudArea, [loc("level"), level], Align.center, Align.top)
    let livesLabel = new Label(hudArea, [lives], Align.right, Align.top, "I1", new Img(texture["ship"]))
    let missilesLabel = new Label(hudArea, [weapon.launcher.ammo], Align.left, Align.bottom, "I1"
        , new Img(texture["missile_icon"]))

    messageLabel = new Label(hudArea, [""], Align.center, Align.center)
    hud = new Layer(scoreLabel, levelLabel, livesLabel, messageLabel, missilesLabel)
    hud.add(new Label(hudArea, [weapon.turret.ammo], Align.right, Align.bottom, "I10"
        , new Img(texture["ammo_icon"])))

    // canvas

    currentCanvas.background = "rgb(9, 44, 84)"

    initUpdate(texture)
}


project.locales.en = {
    // hud

    level: "LEVEL ",
    pressEnter: "PRESS ENTER",
    gameOver: "GAME OVER",
    paused: "PAUSED",
    ammo: "AMMO: ",
    missiles: "MISSILES: ",

    // keys

    left: "Turn left",
    right: "Turn right",
    forward: "Thrust",
    fire: "Fire",
    pause: "Pause",
}

project.locales.ru = {
    level: "УРОВЕНЬ ",
    pressEnter: "НАЖМИТЕ ENTER",
    gameOver: "ИГРА ОКОНЧЕНА",
    paused: "ПАУЗА",
    ammo: "ПАТРОНЫ: ",
    missiles: "РАКЕТЫ: ",

    left: "Повернуть влево",
    right: "Повернуть вправо",
    forward: "Ускоряться",
    fire: "Стрелять",
    pause: "Пауза",
}
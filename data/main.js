import {project} from "../../Furca/src/project.js"
import {Img} from "../../Furca/src/image.js"
import {Key} from "../../Furca/src/key.js"
import {Align, defaultCanvas, defaultFontSize, loc, texture} from "../../Furca/src/system.js"
import {Box} from "../../Furca/src/box.js"
import {currentCanvas} from "../../Furca/src/canvas.js"
import {Label} from "../../Furca/src/gui/label.js"
import {Layer} from "../../Furca/src/layer.js"
import {explosions, initUpdate, level, lives, score} from "../main.js"
import {initLauncher} from "../launcher.js"
import {initFireball} from "../fireball.js"
import {initTurret} from "../turret.js"

import {initExplodingAsteroid} from "../exploding_asteroid.js"
import {initShip} from "../ship.js"
import {Rnd} from "../../Furca/src/function/rnd.js"
import {LoopArea} from "../../Furca/src/actions/sprite/loop_area.js"
import {fireballSettings} from "./fireball.js"
import {launcherSettings} from "./launcher.js"
import {turretSettings} from "./turret.js"
import {asteroids} from "./asteroids.js"
import {Cos} from "../../Furca/src/function/cos.js"
import {rad} from "../../Furca/src/functions.js"
import "./text.js"

export let left = new Key("ArrowLeft")
export let right = new Key("ArrowRight")
export let forward = new Key("ArrowUp")
export let newGame = new Key("Enter")
export let pause = new Key("KeyP")

export let messageLabel, hud, bounds

export const mainSettings = {
    lives: 3,
    startingLives: 3,
    lifeBonus: 25000,
    levelBonus: 1000,
    invulnerabilityTime: 2,

    bonus: {
        sizeAnimation: new Cos(0.45, 0.1, 0, 1),
        angleAnimation: new Cos(0.9, rad(15)),
    },

    explosion: {
        layer: explosions,
        images: {
            texture: "explosion",
            columns: 4,
            rows: 4,
            widthMul: 2,
            heightMul: 2,
        },
        angle: new Rnd(360),
        animationSpeed: 16
    },

    weapon: {
        fireball: fireballSettings,
        turret: turretSettings,
        launcher: launcherSettings,
    }
}


project.init = () => {
    defaultCanvas(20, 20)

    bounds = new Box(0, 0, currentCanvas.width + 3, currentCanvas.height + 3)
    project.actions.push(
        new LoopArea(asteroids, bounds)
    )

    initShip()
    initExplodingAsteroid()

    initFireball()
    initTurret()
    initLauncher()

    let weapon = mainSettings.weapon
    mainSettings.startingWeapon = weapon.fireball

    // gui

    let hudArea = new Box(0, 0, currentCanvas.width - 1, currentCanvas.height - 1)

    let scoreLabel = new Label(hudArea, [score], defaultFontSize, Align.left, Align.top, "Z8")
    let levelLabel = new Label(hudArea, [loc("level"), level], defaultFontSize, Align.center, Align.top)
    let livesLabel = new Label(hudArea, [lives], defaultFontSize, Align.right, Align.top, "I1", new Img(texture["ship"]))
    let missilesLabel = new Label(hudArea, [weapon.launcher.ammo], defaultFontSize, Align.left, Align.bottom, "I1"
        , new Img(texture["missile_icon"]))

    messageLabel = new Label(hudArea, [""], defaultFontSize, Align.center, Align.center)
    hud = new Layer(scoreLabel, levelLabel, livesLabel, messageLabel, missilesLabel)
    hud.add(new Label(hudArea, [weapon.turret.ammo], defaultFontSize, Align.right, Align.bottom, "I10"
        , new Img(texture["ammo_icon"])))

    // canvas

    currentCanvas.background = "rgb(9, 44, 84)"

    initUpdate()
}

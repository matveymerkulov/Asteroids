import {bullets} from "../main.js"
import {Num} from "../../Furca/src/variable/number.js"
import {Turbo} from "../turbo.js"
import {Key} from "../../Furca/src/key.js"

export let fireMissile = new Key("KeyX")

export const launcherSettings = {
    missile: {
        layer: bullets,
        image: {
            texture: "missile",
            xMul: 0.95,
            yMul: 0.5,
            widthMul: 10,
            heightMul: 3,
        },
        size: 0.15,
        speed: 15,
        parameters: {
            damage: 300,
            explosionSize: 5,
        },
    },

    bonus: {
        image: {
            texture: "missile_bonus",
        },
        probability: 0.1,
    },

    ammo: new Num(3),
    maxAmmo: 8,
    controller: new Turbo(fireMissile, 0.5),
}
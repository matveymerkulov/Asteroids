import {Turbo} from "../turbo.js"
import {bullets, shipLayer} from "../main.js"
import {Num} from "../../Furca/src/variable/number.js"
import {fire} from "./fireball.js"

export const turretSettings = {
    sprite: {
        image: {
            texture: "turret",
        },
        width: 2,
        height: 2,
    },

    gunfire: {
        image: {
            texture: "gunfire",
            xMul: 0,
        },
        size: 1,
        visible: false,
    },

    controller: new Turbo(fire, 0.10),

    bullet: {
        layer: bullets,
        image: {
            texture: "bullet",
        },
        size: 0.12,
        speed: 30,
        parameters: {
            damage: 50,
            explosionSize: 0.5,
        }
    },

    bonus: {
        image: {
            texture: "turret_bonus",
        },
        probability: 0.1,
    },

    probability: 0.1,
    ammo: new Num(),
    bonusAmmo: 50,
    maxAmmo: 100,
    gunfireTime: 0.05
}
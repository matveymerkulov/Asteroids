import {Turbo} from "../turbo.js"
import {Key} from "../../Furca/src/key.js"

export let fire = new Key("Space")

export const fireballSettings = {
    bullet: {
        images: {
            texture: "fireball",
            columns: 1,
            rows: 16,
            xMul: 43 / 48,
            yMul: 5.5 / 12,
            widthMul: 5.25,
            heightMul: 1.5,
        },
        size: 0.3,
        speed: 15,
        //angle: new Rnd(rad(-10), rad(10)),
        animationSpeed: 16.0,
        parameters: {
            damage: 100,
            explosionSize: 0.8,
        }
    },
    controller: new Turbo(fire, 0.15),
}

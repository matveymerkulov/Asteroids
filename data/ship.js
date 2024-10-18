import {Cos} from "../../Furca/src/function/cos.js"
import {rad} from "../../Furca/src/functions.js"

export const shipSettings = {
    sprite: {
        image: {
            texture: "ship",
            widthMul: 1.75,
            heightMul: 1.75,
        },
        angle: 0,
        speed: 0,
    },

    acceleration: 25,
    deceleration: 15,
    accelerationLimit: 7.5,
    angularSpeed: 180,

    flame: {
        images: {
            texture: "flame",
            columns: 3,
            rows: 3,
            xMul: 0.5,
            yMul: 1,
        },
        x: -0.6,
        y: 0,
        width: 1,
        height: 1,
        angle: rad(-90),
        animation: new Cos(0.1, 0.1, 0, 0.95),
    }
}
import {Rnd} from "../../Furca/src/function/rnd.js"
import {Mul} from "../../Furca/src/function/mul.js"
import {rnds} from "../../Furca/src/function/random_sign.js"
import {Layer} from "../../Furca/src/layer.js"

const asteroidImages = {
    texture: "asteroid",
    columns: 8,
    rows: 4,
    widthMul: 1.5,
    heightMul: 1.5,
}

export const asteroids = new Layer()

export const asteroidSettings = {
    big: {
        images: asteroidImages,
        size: 3,
        angle: new Rnd(-15, 15),
        speed: new Rnd(2, 3),
        animationSpeed: new Mul(new Rnd(12, 20), rnds),
        rotationSpeed: new Rnd(-180, 180),
        score: 100,
        parameters: {
            hp: 300,
        },
        pieces: [
            {
                type: "medium",
                angle: 0,
            }, {
                type: "small",
                angle: 60,
            }, {
                type: "small",
                angle: -60,
            },
        ]
    },

    medium: {
        images: asteroidImages,
        size: 2,
        angle: new Rnd(-15, 15),
        speed: new Rnd(2.5, 4),
        animationSpeed: new Mul(new Rnd(16, 25), rnds),
        rotationSpeed: new Rnd(-180, 180),
        score: 200,
        parameters: {
            hp: 200,
        },
        pieces: [{
            type: "small",
            angle: 60,
        }, {
            type: "small",
            angle: -60,
        }]
    },

    small: {
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
        pieces: [],
    },

    exploding: {
        images: {
            texture: "asteroid",
            columns: 8,
            rows: 4,
            widthMul: 1.5,
            heightMul: 1.5,
        },
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
}
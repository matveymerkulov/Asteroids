import {apsk} from "../Furca/src/system.js"
import {Action} from "../Furca/src/actions/action.js"

export class Turbo extends Action {
    constructor(key, cooldown) {
        super()
        this.key = key
        this.cooldown = cooldown
        this.time = 0
    }

    active() {
        if(this.time > 0) {
            this.time -= apsk
            return false
        } else {
            if(!this.key.isDown) return false
            this.time = this.cooldown
            return true
        }
    }
}
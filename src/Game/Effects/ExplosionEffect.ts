import {scene} from "../../Engine/Engine";
import {animations} from "../../Engine/Resources/Graphics/Graphics";
import {Sprite} from "../Basic/Sprite";

export class ExplosionEffect extends Sprite {

    constructor(x: number, y: number, size: number) {
        super();
        this.x = x - size / 2;
        this.y = y - size / 2;
        this.width = size;
        this.height = size;
        this.drawable = animations.explosion;
    }

    logic(): void {
        if (this.drawable.isExpired(this.getAge())) {
            scene.remove(this);
        }
    }

}

import {scene} from "../../Engine/Engine";
import {textures} from "../../Engine/Resources/Graphics/Graphics";
import {Sprite} from "../Basic/Sprite";

export class CoinFromCoinboxEffect extends Sprite {

    public dy: number;

    constructor(x: number, y: number) {
        super();
        this.x = x - 0.3;
        this.y = y - 0.3;
        this.width = 0.6;
        this.height = 0.6;
        this.drawable = textures.coin;
        this.dy = -0.5;
    }

    logic(): void {
        this.y += this.dy;
        this.dy += 0.08;
        if (this.dy >= 0.5) {
            scene.remove(this);
        }
    }

    getZIndex(): number {
        return 3;
    }

}

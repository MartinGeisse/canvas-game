
namespace Game {

    export class CoinFromCoinboxEffect extends Sprite {

        public dy : number;

        constructor(x : number, y : number) {
            super();
            this.x = x - 0.3;
            this.y = y - 0.3;
            this.width = 0.6;
            this.height = 0.6;
            this.image = Resources.textures.coin;
            this.dy = -0.5;
        }

        logic() : void {
            this.saveOldPosition();
            this.y += this.dy;
            this.dy += 0.2;
            if (this.dy >= 0.5) {
                Engine.scene.remove(this);
            }
        }
        getZIndex() : number {
            return 3;
        }

    }

}

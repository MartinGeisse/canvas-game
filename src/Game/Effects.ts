
namespace Game {

    export class CoinFromCoinboxEffect implements Engine.SceneObject {

        public x : number;
        private oldY : number = 0;
        public y : number;
        public dy : number;

        constructor(x : number, y : number) {
            this.x = x;
            this.oldY = y;
            this.dy = -0.5;
            this.y = y + this.dy;
        }

        logic() : void {
            this.oldY = this.y;
            this.y += this.dy;
            this.dy += 0.2;
            if (this.dy >= 0.5) {
                Engine.scene.remove(this);
            }
        }

        draw(fraction : number) : void {
            var y = this.oldY + (this.y - this.oldY) * fraction;
            Engine.canvasContext.fillStyle = 'blue';
            Engine.canvasContext.fillRect(this.x - 0.2, y - 0.2, 2 * 0.2, 2 * 0.2);
        }

        getZIndex() : number {
            return 3;
        }

    }

}

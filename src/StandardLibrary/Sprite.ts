
namespace StandardLibrary {

    export abstract class Sprite implements Engine.SceneObject {

        public x : number;
        public y : number;
        public width : number = 50;
        public height : number = 50;
        public oldX : number;
        public oldY : number;
        public drawable : Resources.Drawable;
        public creationTimestamp : number = Engine.renderTimestamp;

        public getAge() : number {
            return Engine.renderTimestamp - this.creationTimestamp;
        }

        abstract logic() : void;

        // to be called at the beginning of logic()
        protected saveOldPosition() {
            this.oldX = this.x;
            this.oldY = this.y;
        }

        draw(fraction : number) : void {
            if (typeof this.oldX == 'undefined') {
                console.error('saveOldPosition() not called in ' + this.constructor.name);
            }
            var x = this.oldX + fraction * (this.x - this.oldX);
            var y = this.oldY + fraction * (this.y - this.oldY);
            this.drawable.draw(x, y, this.width, this.height, this.getAge());
        }

        abstract getZIndex() : number;

        protected findCollidingSprite<T extends Sprite>(constructor : Engine.Constructor<T>) : T {
            var result : T = null;
            var handleSprite = (sprite : T) => {
                if (sprite.x >= this.x + this.width) {
                    return;
                }
                if (sprite.x + sprite.width <= this.x) {
                    return;
                }
                if (sprite.y >= this.y + this.height) {
                    return;
                }
                if (sprite.y + sprite.height <= this.y) {
                    return;
                }
                result = sprite;
            }
            Engine.scene.foreach(constructor, handleSprite);
            return result;
        }

    }

}


namespace StandardLibrary {

    export abstract class Sprite implements Engine.SceneObject {

        public x : number;
        public y : number;
        public width : number = 50;
        public height : number = 50;
        public oldX : number;
        public oldY : number;
        public image : HTMLImageElement;

        abstract logic() : void;

        // to be called at the beginning of logic()
        protected saveOldPosition() {
            this.oldX = this.x;
            this.oldY = this.y;
        }

        draw(fraction : number) : void {
            var x = this.oldX + fraction * (this.x - this.oldX);
            var y = this.oldY + fraction * (this.y - this.oldY);
            Engine.canvasContext.drawImage(this.image, x, y, this.width, this.height);
        }

        abstract getZIndex() : number;

    }

}

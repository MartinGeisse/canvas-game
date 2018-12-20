
namespace Game {

    export class Scene extends Engine.Scene {

        public map : StandardLibrary.Map;
        public player : Player;

        constructor()  {
            super();
            this.add(new Background());
        }

    }

    export class Background implements Engine.SceneObject {

        logic() : void {
        }

        draw(fraction : number) : void {
            Engine.canvasContext.scale(30, 30);
            Engine.canvasContext.fillStyle = '#000000';
            Engine.canvasContext.fillRect(0, 0, Engine.canvas.width, Engine.canvas.height);
        }

        getZIndex() : number {
            return 0;
        }

    }

    export class BlockType extends StandardLibrary.BlockType {

        constructor(image : HTMLImageElement, public solid : boolean) {
            super(image);
        }

    }

    export abstract class Sprite extends StandardLibrary.Sprite {

        getZIndex() : number {
            return 2;
        }

    }
    
}

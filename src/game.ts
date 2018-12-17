
namespace Game {

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

    export class MovingCircle implements Engine.SceneObject {

        public x : number;
        public y : number;
        public radius : number;
        public speed : number;
        public color : string;
        public zIndex : number;

        constructor(color : string, zIndex : number) {
            this.x = Math.random() * Engine.canvas.width;
            this.y = Math.random() * Engine.canvas.height;
            this.radius = Math.random() * 50 + 5;
            this.speed = Math.random() * 20 + 5;
            this.color = color;
            this.zIndex = zIndex;
        }

        logic() : void {
            this.x = (this.x + this.speed) % 500;
        }

        draw(fraction : number) : void {
            var ix = this.x + fraction * this.speed;
            Engine.canvasContext.fillStyle = this.color;
            Engine.canvasContext.beginPath();
            Engine.canvasContext.arc(ix, this.y, this.radius, 0, 2 * Math.PI);
            Engine.canvasContext.fill();
        }

        getZIndex() : number {
            return this.zIndex;
        }

    }

    export function initialize() {

        var blockTable : Blockmap.BlockType[] = [
            new Blockmap.BlockType(null),
            new Blockmap.BlockType(Resources.textures['emptybox']),
            new Blockmap.BlockType(Resources.textures['coinbox']),
        ];
        var map : Blockmap.Map = new Blockmap.Map(10, 5, blockTable);
        for (var i = 0; i < 10; i++) {
            map.setCode(i, 0, 1);
            map.setCode(i, 4, 1);
        }
        for (var i = 0; i < 10; i++) {
            map.setCode(0, i, 1);
            map.setCode(9, i, 1);
        }
        map.setCode(1, 1, 2);
        map.setCode(8, 1, 2);

        Engine.scene.add(new Background());
        Engine.scene.add(map);
        for (var i = 0; i < 50; i++) {
            if (Math.random() < 0.5) {
                Engine.scene.add(new MovingCircle('#0000ff', 10));
            } else {
                Engine.scene.add(new MovingCircle('#ff0000', 20));
            }
        }
    }

}

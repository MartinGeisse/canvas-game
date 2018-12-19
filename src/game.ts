
namespace Game {

    export class BlockType extends Blockmap.BlockType {

        constructor(image : HTMLImageElement, public solid : boolean) {
            super(image);
        }

    }

    export class Scene extends Engine.Scene {

        public map : Blockmap.Map;
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

    export class Player implements Engine.SceneObject {

        public static INITIAL_JUMP_POWER : number = 3;
        public static JUMP_SPEED : number = 0.5;
        public static MAX_FALL_SPEED : number = 0.4;
        public static RUN_ACCELERATION : number = 0.05 ;
        public static RUN_DECELERATION : number = 0.02;
        public static RUN_SPEED : number = 0.3;
        public static RADIUS_X : number = 0.3;
        public static RADIUS_Y : number = 0.5;
        public static GRAVITY : number = 0.1;

        public x : number = 0;
        public y : number = 0;
        public dx : number = 0;
        public dy : number = 0;
        public jumpPower : number = 0;

        private oldX : number = 0;
        private oldY : number = 0;

        logic() : void {

            // remember old position for interpolation
            this.oldX = this.x;
            this.oldY = this.y;
            
            // left/right movement
            if (Engine.keyState['ArrowLeft']) {
                this.dx -= Player.RUN_ACCELERATION;
            } else if (Engine.keyState['ArrowRight']) {
                this.dx += Player.RUN_ACCELERATION;
            } else if (this.dx < 0) {
                this.dx += Player.RUN_DECELERATION;
                if (this.dx > 0) {
                    this.dx = 0;
                }
            } else if (this.dx > 0) {
                this.dx -= Player.RUN_DECELERATION;
                if (this.dx < 0) {
                    this.dx = 0;
                }
            }
            if (this.dx < -Player.RUN_SPEED) {
                this.dx = -Player.RUN_SPEED;
            }
            if (this.dx > Player.RUN_SPEED) {
                this.dx = Player.RUN_SPEED;
            }
            this.x += this.dx;
            if (this.collidesWithBlockmap()) {
                if (this.dx > 0) {
                    this.x = Math.ceil(this.x) - Player.RADIUS_X;
                } else {
                    this.x = Math.floor(this.x) + Player.RADIUS_X;
                }
                this.dx = 0;
            }

            // jumping and falling
            if (this.dy < 0) {

                if (Engine.keyState['ArrowUp'] && this.jumpPower > 0) {
                    this.dy = -Player.JUMP_SPEED;
                    this.jumpPower--;
                } else {
                    this.jumpPower = 0;
                    this.dy += Player.GRAVITY;
                }
                this.y += this.dy;
                if (this.collidesWithBlockmap()) {
                    this.y = Math.floor(this.y) + Player.RADIUS_Y;
                    this.dy = 0;
                }
            } else {
                this.dy += Player.GRAVITY;
                if (this.dy > Player.MAX_FALL_SPEED) {
                    this.dy = Player.MAX_FALL_SPEED;
                }
                this.y += this.dy;
                if (this.collidesWithBlockmap()) {
                    this.y = Math.ceil(this.y) - Player.RADIUS_Y;
                    this.dy = 0;
                    this.jumpPower = Player.INITIAL_JUMP_POWER;
                    if (Engine.keyState['ArrowUp']) {
                        this.dy = -Player.JUMP_SPEED;
                    }
                }
            }

            // collecting coins
            var map : Blockmap.Map = (Engine.scene as Scene).map;
            var blockCode = map.getCode(Math.floor(this.x), Math.floor(this.y));
            if (blockCode == 3) {
                map.setCode(Math.floor(this.x), Math.floor(this.y), 0);
            }

        }

        private collidesWithBlockmap() : boolean {
            var map : Blockmap.Map = (Engine.scene as Scene).map;
            return map.any(this.x - Player.RADIUS_X, this.y - Player.RADIUS_Y, this.x + Player.RADIUS_X, this.y + Player.RADIUS_Y, type => (type as BlockType).solid);
        }

        draw(fraction : number) : void {
            var x = this.oldX + (this.x - this.oldX) * fraction;
            var y = this.oldY + (this.y - this.oldY) * fraction;
            Engine.canvasContext.fillStyle = 'red';
            Engine.canvasContext.fillRect(x - Player.RADIUS_X, y - Player.RADIUS_Y, 2 * Player.RADIUS_X, 2 * Player.RADIUS_Y);
        }

        getZIndex() : number {
            return 2;
        }

    }

    export function initialize() {

        var scene : Scene = new Scene();
        Engine.scene = scene;

        var blockTable : Blockmap.BlockType[] = [
            new BlockType(null, false),
            new BlockType(Resources.textures['emptybox'], true),
            new BlockType(Resources.textures['coinbox'], true),
            new BlockType(Resources.textures['coin'], false),
        ];
        var map : Blockmap.Map = new Blockmap.Map(20, 10, blockTable);
        scene.map = map;

        for (var i = 0; i < 20; i++) {
            map.setCode(i, 0, 1);
            map.setCode(i, 9, 1);
        }
        for (var i = 0; i < 10; i++) {
            map.setCode(0, i, 1);
            map.setCode(19, i, 1);
        }
        map.setCode(1, 1, 2);
        map.setCode(18, 1, 2);
        for (var i = 10; i < 13; i++) {
            map.setCode(i, 6, 3);
        }

        scene.add(map);

        var player : Player = new Player();
        player.x = 2;
        player.y = 3.0;
        scene.add(player);
        scene.player = player;

    }

}


namespace Game {

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
                    // check for coinbox
                    var map : StandardLibrary.Map = (Engine.scene as Scene).map;
                    var coinboxX = Math.floor(this.x);
                    var coinboxY = Math.floor(this.y) - 1;
                    if (map.getCode(coinboxX, coinboxY) == 2) {
                        map.setCode(coinboxX, coinboxY, 1);
                        Engine.scene.add(new CoinFromCoinboxEffect(coinboxX + 0.5, coinboxY + 0.5));
                    }
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
            var map : StandardLibrary.Map = (Engine.scene as Scene).map;
            var blockCode = map.getCode(Math.floor(this.x), Math.floor(this.y));
            if (blockCode == 3) {
                map.setCode(Math.floor(this.x), Math.floor(this.y), 0);
            }

        }

        private collidesWithBlockmap() : boolean {
            var map : StandardLibrary.Map = (Engine.scene as Scene).map;
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
    
}

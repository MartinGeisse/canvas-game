
namespace Game {

    export class Player extends Sprite {

        public static INITIAL_JUMP_POWER : number = 3;
        public static JUMP_SPEED : number = 0.5;
        public static MAX_FALL_SPEED : number = 0.4;
        public static RUN_ACCELERATION : number = 0.05 ;
        public static RUN_DECELERATION : number = 0.02;
        public static RUN_SPEED : number = 0.3;
        public static WIDTH : number = 0.6;
        public static HEIGHT : number = 1.0;
        public static GRAVITY : number = 0.1;

        public dx : number = 0;
        public dy : number = 0;
        public jumpPower : number = 0;

        constructor() {
            super();
            this.image = Resources.textures.playerRight;
            this.width = Player.WIDTH;
            this.height = Player.HEIGHT;
        }

        logic() : void {
            this.saveOldPosition();
            
            // left/right movement
            if (Engine.keyState['ArrowLeft']) {
                this.dx -= Player.RUN_ACCELERATION;
                this.image = Resources.textures.playerLeft;
            } else if (Engine.keyState['ArrowRight']) {
                this.dx += Player.RUN_ACCELERATION;
                this.image = Resources.textures.playerRight;
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
                    this.x = Math.ceil(this.x) - this.width;
                } else {
                    this.x = Math.ceil(this.x);
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
                    this.y = Math.ceil(this.y);
                    this.dy = 0;
                    // check for coinbox
                    var map : StandardLibrary.Map = (Engine.scene as Scene).map;
                    var coinboxX = Math.round(this.x);
                    var coinboxY = this.y - 1;
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
                    this.y = Math.ceil(this.y) - this.height;
                    this.dy = 0;
                    this.jumpPower = Player.INITIAL_JUMP_POWER;
                    if (Engine.keyState['ArrowUp']) {
                        this.dy = -Player.JUMP_SPEED;
                    }
                }
            }

            // collecting coins
            var map : StandardLibrary.Map = (Engine.scene as Scene).map;
            var mapX = Math.floor(this.x + this.width / 2);
            var mapY = Math.floor(this.y + this.height / 2);
            var blockCode = map.getCode(mapX, mapY);
            if (blockCode == 3) {
                map.setCode(mapX, mapY, 0);
            }

        }

        private collidesWithBlockmap() : boolean {
            var map : StandardLibrary.Map = (Engine.scene as Scene).map;
            return map.any(this.x, this.y, this.x + this.width, this.y + this.height, type => (type as BlockType).solid);
        }

    }
    
}

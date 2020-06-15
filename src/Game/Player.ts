
namespace Game {

    export class Player extends Sprite {

        public static INITIAL_JUMP_POWER : number = 3;
        public static JUMP_SPEED : number = 1.0;
        public static MAX_FALL_SPEED : number = 1.0;
        public static RUN_ACCELERATION : number = 0.4 ;
        public static RUN_DECELERATION : number = 0.3;
        public static RUN_SPEED : number = 0.8;
        public static WIDTH : number = 0.6;
        public static HEIGHT : number = 1.0;
        public static GRAVITY : number = 0.3;

        private scene : Game.Scene;
        public dx : number = 0;
        public dy : number = 0;
        public jumpPower : number = 0;
        public shootCooldown : number = 0;
        public facing : number = 1;

        constructor() {
            super();
            this.drawable = Resources.textures.playerRight;
            this.width = Player.WIDTH;
            this.height = Player.HEIGHT;
        }

        initialize(scene : Engine.Scene) : void {
            this.scene = scene as Game.Scene;
        }

        logic() : void {
            this.saveOldPosition();
            
            // determine left/right movement
            if (Engine.keyState['ArrowLeft']) {
                this.dx -= Player.RUN_ACCELERATION;
                this.drawable = Resources.textures.playerLeft;
                this.facing = -1;
            } else if (Engine.keyState['ArrowRight']) {
                this.dx += Player.RUN_ACCELERATION;
                this.drawable = Resources.textures.playerRight;
                this.facing = 1;
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

            // determine jumping and falling
            if (Engine.keyState['ArrowUp'] && this.jumpPower > 0) {
                this.dy = -Player.JUMP_SPEED;
                this.jumpPower--;
            } else {
                this.jumpPower = 0;
                this.dy += Player.GRAVITY;
                if (this.dy > Player.MAX_FALL_SPEED) {
                    this.dy = Player.MAX_FALL_SPEED;
                }
            }

            // perform movement
            this.move(this.dx, this.dy);

            // shooting
            if (this.shootCooldown == 0) {
                if (Engine.keyState[' ']) {
                    this.shootCooldown = 5;
                    var bulletX = this.x + this.width / 2;
                    var bulletY = this.y + this.height / 2;
                    this.scene.add(new PlayerBullet(bulletX, bulletY, this.facing, -0.2));
                    this.scene.add(new PlayerBullet(bulletX, bulletY, this.facing, 0));
                    this.scene.add(new PlayerBullet(bulletX, bulletY, this.facing, 0.2));
                    Resources.sounds.shoot.play();
                }
            } else {
                this.shootCooldown--;
            }

            // scrolling
            this.scrollTo(this.scene, 5);
            this.scene.map.confineScrolling();

        }

        private move(moveX : number, moveY : number) {
            var map = this.scene.map;

            // split large movements; x/y delta must be less than both 0.5 and half the sprite size
            if (moveX >= 0.3 || moveX <= -0.3 || moveY >= 0.3 || moveY <= -0.3) {
                moveX /= 2;
                moveY /= 2;
                this.move(moveX, moveY);
                this.move(moveX, moveY);
                return;
            }

            // x movement
            this.x += moveX;
            if (this.collidesWithBlockmap()) {
                if (moveX > 0) {
                    this.x = Math.ceil(this.x) - this.width;
                } else {
                    this.x = Math.ceil(this.x);
                }
                this.dx = 0;
            }

            // y movement
            this.y += moveY;
            if (this.collidesWithBlockmap()) {
                this.dy = 0;
                if (moveY < 0) {
                    this.y = Math.ceil(this.y);
                    this.jumpPower = 0;
                    // check for coinbox
                    var coinboxX = Math.round(this.x);
                    var coinboxY = this.y - 1;
                    if (map.getCode(coinboxX, coinboxY) == 2) {
                        map.setCode(coinboxX, coinboxY, 1);
                        this.scene.add(new CoinFromCoinboxEffect(coinboxX + 0.5, coinboxY + 0.5));
                        Resources.sounds.coin.play();
                    }
                } else {
                    this.y = Math.ceil(this.y) - this.height;
                    this.jumpPower = Player.INITIAL_JUMP_POWER;
                }
            }

            // collecting coins
            var mapX = Math.floor(this.x + this.width / 2);
            var mapY = Math.floor(this.y + this.height / 2);
            var blockCode = map.getCode(mapX, mapY);
            if (blockCode == 3) {
                map.setCode(mapX, mapY, 0);
                Resources.sounds.coin.play();
            }

            // touch special blocks
            map.foreach(this.x, this.y, this.x + this.width, this.y + this.height, (x, y, type) => {
                if (type instanceof BlockType) {
                    if ("onPlayerTouch" in type) {
                        type.onPlayerTouch(this, x, y);
                    }
                }
            });

        }

    }
    
}

import {GameScene, getGameScene} from "./Basic/GameScene";
import {textures} from "../Engine/Resources/Graphics/Graphics";
import {Sprite} from "./Basic/Sprite";
import {keyState} from "../Engine/Engine";
import {PlayerBullet} from "./Bullet";
import {sounds} from "../Engine/Resources/Sound/Sounds";
import {CoinFromCoinboxEffect} from "./Effects/CoinFromCoinboxEffect";

export class Player extends Sprite {

    public static INITIAL_JUMP_POWER: number = 3;
    public static JUMP_SPEED: number = 0.25;
    public static MAX_FALL_SPEED: number = 0.1;
    public static RUN_ACCELERATION: number = 0.05;
    public static RUN_DECELERATION: number = 0.01;
    public static RUN_SPEED: number = 0.1;
    public static WIDTH: number = 0.6;
    public static HEIGHT: number = 1.0;
    public static GRAVITY: number = 0.01;

    public dx: number = 0;
    public dy: number = 0;
    public jumpPower: number = 0;
    public shootCooldown: number = 0;
    public facing: number = 1;

    constructor() {
        super();
        this.drawable = textures.playerRight;
        this.width = Player.WIDTH;
        this.height = Player.HEIGHT;
    }

    initialize(scene: GameScene): void {
    }

    logic(): void {
        const scene = getGameScene();

        // determine left/right movement
        if (keyState['ArrowLeft']) {
            this.dx -= Player.RUN_ACCELERATION;
            this.drawable = textures.playerLeft;
            this.facing = -1;
        } else if (keyState['ArrowRight']) {
            this.dx += Player.RUN_ACCELERATION;
            this.drawable = textures.playerRight;
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
        if (keyState['ArrowUp'] && this.jumpPower > 0) {
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
            if (keyState[' ']) {
                this.shootCooldown = 20;
                const bulletX = this.x + this.width / 2;
                const bulletY = this.y + this.height / 2;
                scene.add(new PlayerBullet(bulletX, bulletY, this.facing, -0.2));
                scene.add(new PlayerBullet(bulletX, bulletY, this.facing, 0));
                scene.add(new PlayerBullet(bulletX, bulletY, this.facing, 0.2));
                sounds.shoot.play();
            }
        } else {
            this.shootCooldown--;
        }

        // scrolling
        this.scrollTo(scene, 5);
        scene.map.confineScrolling();

    }

    private move(moveX: number, moveY: number) {
        const scene = getGameScene();
        const map = scene.map;

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
                const coinboxX = Math.round(this.x);
                const coinboxY = this.y - 1;
                if (map.getCode(coinboxX, coinboxY) == 2) {
                    map.setCode(coinboxX, coinboxY, 1);
                    scene.add(new CoinFromCoinboxEffect(coinboxX + 0.5, coinboxY + 0.5));
                    sounds.coin.play();
                }
            } else {
                this.y = Math.ceil(this.y) - this.height;
                this.jumpPower = Player.INITIAL_JUMP_POWER;
            }
        }

        // collecting coins
        const mapX = Math.floor(this.x + this.width / 2);
        const mapY = Math.floor(this.y + this.height / 2);
        const blockCode = map.getCode(mapX, mapY);
        if (blockCode == 3) {
            map.setCode(mapX, mapY, 0);
            sounds.coin.play();
        }

        // touch special blocks
        map.foreach(this.x, this.y, this.x + this.width, this.y + this.height, (x, y, type) => {
            if (type.onPlayerTouch) {
                type.onPlayerTouch(this, x, y);
            }
        });

    }

}

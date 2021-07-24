import {scene} from "../Engine/Engine";
import {ExplosionEffect} from "./Effects/ExplosionEffect";
import {Sprite} from "./Basic/Sprite";
import {textures} from "../Engine/Resources/Graphics/Graphics";
import {sounds} from "../Engine/Resources/Sound/Sounds";

// right "hand" touches a wall
export class Enemy extends Sprite {

    private dx: number;
    private dy: number;
    private flashTime: number;
    private health: number = 10;

    constructor(wallTouchX: number, wallTouchY: number, dx: number, dy: number) {
        super();
        const size = 0.7;
        const halfSize = size / 2;

        this.width = size;
        this.height = size;
        this.x = wallTouchX - halfSize;
        this.y = wallTouchY - halfSize;
        this.dx = dx;
        this.dy = dy;
        this.drawable = textures.enemy;
        this.flashTime = 0;

        if (dy < 0) {
            this.x -= halfSize;
        }
        if (dx > 0) {
            this.y -= halfSize;
        }
    }

    logic(): void {
        const oldX = this.x;
        const oldY = this.y;

        // handle flashing when hit
        if (this.flashTime > 0) {
            this.flashTime--;
            if (this.flashTime <= 0) {
                this.drawable = textures.enemy;
            }
        }

        // retry at most 3 times, so we don't crash the application if this enemy is stuck in a wall
        let retries = 3;
        while (retries > 0) {

            // try moving around an outer corner
            this.x -= this.dy;
            this.y += this.dx;
            if (!this.collidesWithBlockmap()) {
                this.turnRight();
                return;
            } else {
                this.x = oldX;
                this.y = oldY;
            }

            // try moving ahead
            this.x += this.dx;
            this.y += this.dy;
            if (!this.collidesWithBlockmap()) {
                return;
            } else {
                this.x = oldX;
                this.y = oldY;
            }

            // we hit an inner corner
            this.turnLeft();
            retries--;

        }

    }

    private turnLeft(): void {
        const temp = this.dx;
        this.dx = this.dy;
        this.dy = -temp;
    }

    private turnRight(): void {
        const temp = this.dx;
        this.dx = -this.dy;
        this.dy = temp;
    }

    public hitByBullet(): void {
        this.health--;
        if (this.health > 0) {
            this.flashTime = 2;
            this.drawable = textures.enemyHit;
        } else {
            scene.add(new ExplosionEffect(this.x + this.width / 2, this.y + this.height / 2, 2));
            scene.remove(this);
            sounds.kill.play();
        }
    }

}

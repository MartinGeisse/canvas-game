import {scene} from "../Engine/Engine";
import {ExplosionEffect} from "./Effects/ExplosionEffect";
import {Enemy} from "./Enemy";
import {textures} from "../Engine/Resources/Graphics/Graphics";
import {Sprite} from "./Basic/Sprite";
import {BlockType} from "./BlockMap/BlockType";
import {GameScene} from "./Basic/GameScene";
import {globalBlockTypeTable} from "./GlobalBlockTypeTable";

export class PlayerBullet extends Sprite {

    public dx: number;
    public dy: number;

    constructor(x: number, y: number, dx: number, dy: number) {
        super();
        this.x = (dx > 0 ? x : (x - 0.4));
        this.y = y - 0.15;
        this.width = 0.4;
        this.height = 0.3;
        this.dx = dx;
        this.dy = dy;
        this.drawable = (dx > 0 ? textures.bulletRight : textures.bulletLeft);
    }

    logic(): void {
        this.move(this.dx, this.dy);
        const enemy: Enemy|null = this.findCollidingSprite(Enemy);
        if (enemy) {
            scene.remove(this);
            enemy.hitByBullet();
        }
    }

    private move(dx: number, dy: number): void {

        // split fast movement into smaller steps to avoid missing a collision
        if (dx > 0.3 || dx < -0.3) {
            dx /= 2;
            dy /= 2;
            this.move(dx, dy);
            this.move(dx, dy);
            return;
        }

        const collision: [number, number]|null = this.getAnyOneCollisionWithBlockmap();
        if (collision === null) {
            this.x += dx;
            this.y += dy;
            return;
        }

        scene.remove(this);
        scene.add(new ExplosionEffect(this.x + this.width / 2, this.y + this.height / 2, 0.6));
        const blockType: BlockType = (scene as GameScene).map.getBlock(collision[0], collision[1]);
        if (blockType.destroyable) {
            (scene as GameScene).map.setBlock(collision[0], collision[1], globalBlockTypeTable.empty);
            scene.add(new ExplosionEffect(collision[0] + 0.5, collision[1] + 0.5, 1));
        }
    }

}


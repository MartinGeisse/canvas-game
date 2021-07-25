import {SceneObject} from "../../Engine/SceneObject";
import {NULL_DRAWABLE} from "../../Engine/Resources/Graphics/NULL_DRAWABLE";
import {Drawable} from "../../Engine/Resources/Graphics/Drawable";
import {canvas, Constructor, now, scene} from "../../Engine/Engine";
import {Scene} from "../../Engine/Scene";
import {getGameScene} from "./GameScene";
import {Blockmap} from "../BlockMap/Blockmap";
import {BlockType} from "../BlockMap/BlockType";

export abstract class Sprite implements SceneObject {

    public x: number = 0;
    public y: number = 0;
    public width: number = 1;
    public height: number = 1;
    public drawable: Drawable = NULL_DRAWABLE;
    public creationTimestamp: number = now;

    public getAge(): number {
        return now - this.creationTimestamp;
    }

    abstract logic(): void;

    draw(): void {
        this.drawable.draw(this.x, this.y, this.width, this.height, this.getAge());
    }

    getZIndex(): number {
        return 2;
    }

    protected findCollidingSprite<T extends Sprite>(constructor: Constructor<T>): T|null {
        let result: T|null = null;
        const handleSprite = (sprite: T) => {
            if (sprite.x >= this.x + this.width) {
                return;
            }
            if (sprite.x + sprite.width <= this.x) {
                return;
            }
            if (sprite.y >= this.y + this.height) {
                return;
            }
            if (sprite.y + sprite.height <= this.y) {
                return;
            }
            result = sprite;
        }
        scene.foreach(constructor, handleSprite);
        return result;
    }

    public scrollTo(scene: Scene, borderSize: number) {
        if (canvas === null) {
            return;
        }
        const width = canvas.width / scene.scale;
        const height = canvas.height / scene.scale;
        scene.scrollX = Math.max(Math.min(scene.scrollX, this.x - borderSize), this.x + borderSize - width);
        scene.scrollY = Math.max(Math.min(scene.scrollY, this.y - borderSize), this.y + borderSize - height);
    }

    collidesWithBlockmap(): boolean {
        const map: Blockmap = getGameScene().map;
        return map.any(this.x, this.y, this.x + this.width, this.y + this.height, type => (type as BlockType).solid);
    }

    getAnyOneCollisionWithBlockmap(): [number, number]|null {
        const map: Blockmap = getGameScene().map;
        return map.getAnyOneForWhich(this.x, this.y, this.x + this.width, this.y + this.height, type => (type as BlockType).solid);
    }

    getAllCollisionsWithBlockmap(): [number, number][] {
        const map: Blockmap = getGameScene().map;
        return map.getAllForWhich(this.x, this.y, this.x + this.width, this.y + this.height, type => (type as BlockType).solid);
    }

}

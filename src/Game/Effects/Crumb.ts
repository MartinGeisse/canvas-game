import {Sprite} from "../Basic/Sprite";
import {animations} from "../../Engine/Resources/Graphics/Graphics";
import {Drawable} from "../../Engine/Resources/Graphics/Drawable";
import {canvasContext, scene} from "../../Engine/Engine";
import {Scene} from "../../Engine/Scene";

const initialSize = 0.2;

const CRUMB_DRAWABLE: Drawable = {

    draw(x: number, y: number, width: number, height: number, deltaTime?: number): void {
        if (canvasContext) {
            canvasContext.fillStyle = "#804020";
            canvasContext.beginPath();
            canvasContext.arc(x + width / 2, y + height / 2, width / 2, 0, 360);
            canvasContext.fill();
        }
    },

    isExpired(deltaTime: number): boolean {
        return false;
    }

};

export class Crumb extends Sprite {

    private dx: number;
    private dy: number;

    constructor(x: number, y: number, dx: number, dy: number) {
        super();
        this.x = x - initialSize / 2;
        this.y = y - initialSize / 2;
        this.dx = dx;
        this.dy = dy;
        this.width = initialSize;
        this.height = initialSize;
        this.drawable = CRUMB_DRAWABLE;
    }

    initialize(scene: Scene): void {
    }

    logic(): void {

        this.x += this.dx;
        if (this.collidesWithBlockmap()) {
            this.dx = -this.dx;
            this.x += 2 * this.dx;
        }

        this.y += this.dy;
        if (this.collidesWithBlockmap()) {
            this.dy = -this.dy;
            this.y += 2 * this.dy;
        }

        this.dx *= 0.98;
        this.dy *= 0.98;

        if (this.dy < 0.1) {
            this.dy += 0.01;
        }

        this.width -= 0.005;
        this.height -= 0.005;
        if (this.width <= 0 || this.height <= 0) {
            scene.remove(this);
        }

    }

}

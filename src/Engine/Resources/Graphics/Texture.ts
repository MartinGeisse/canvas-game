import {Drawable} from "./Drawable";
import {canvasContext} from "../../Engine";

export class Texture implements Drawable {

    public imageElement: HTMLImageElement;

    constructor(imageElement: HTMLImageElement) {
        this.imageElement = imageElement;
    }

    public draw(x: number, y: number, width: number, height: number, deltaTime: number = 0): void {
        if (canvasContext !== null) {
            canvasContext.drawImage(this.imageElement, x, y, width, height);
        }
    }

    public isExpired(deltaTime: number): boolean {
        return false;
    }

}

import {Drawable} from "./Drawable";
import {canvasContext} from "../../Engine";

export class Animation implements Drawable {

    public frames: HTMLImageElement[];
    public duration: number;

    constructor(frames: HTMLImageElement[], duration: number) {
        this.frames = frames;
        this.duration = duration;
    }

    public draw(x: number, y: number, width: number, height: number, deltaTime: number = 0): void {
        if (canvasContext !== null) {
            const frameIndex: number = Math.floor(deltaTime * this.frames.length / this.duration);
            if (frameIndex >= 0 && frameIndex < this.frames.length) {
                const frame = this.frames[frameIndex];
                canvasContext.drawImage(frame, x, y, width, height);
            }
        }
    }

    public isExpired(deltaTime: number): boolean {
        return deltaTime >= this.duration;
    }

}

import {SceneObject} from "../../Engine/SceneObject";
import {scene} from "../Engine";

export class Delay implements SceneObject {

    private framesLeft: number;
    private callback: () => void;

    constructor(frames: number, callback: () => void) {
        this.framesLeft = frames;
        this.callback = callback;
    }

    logic(): void {
        this.framesLeft--;
        if (this.framesLeft <= 0) {
            scene.remove(this);
            this.callback();
        }
    }

    draw(): void {
    }

    getZIndex(): number {
        return 0;
    }

}

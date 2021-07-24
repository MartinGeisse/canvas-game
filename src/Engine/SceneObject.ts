import {Scene} from "./Scene";

export interface SceneObject {
    initialize?(scene: Scene): void;

    logic(): void;

    draw(): void;

    getZIndex(): number;
}

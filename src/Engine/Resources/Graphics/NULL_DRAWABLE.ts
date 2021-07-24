import {Drawable} from "./Drawable";

export const NULL_DRAWABLE: Drawable = {

    draw(x: number, y: number, width: number, height: number, deltaTime?: number): void {
    },

    isExpired(deltaTime: number): boolean {
        return false;
    },

};

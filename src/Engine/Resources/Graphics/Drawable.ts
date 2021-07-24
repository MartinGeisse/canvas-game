
export interface Drawable {

    draw(x: number, y: number, width: number, height: number, deltaTime?: number): void;

    isExpired(deltaTime: number): boolean;

}

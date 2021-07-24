// current timestamp at the start of the logic frame or animation frame
import {NULL_SCENE, Scene} from "./Scene";

export let now = performance.now();

export let canvas: HTMLCanvasElement | null = null;
export let canvasContext: CanvasRenderingContext2D | null = null;
export let scene: Scene = NULL_SCENE;

function handleLogicFrame() {
    scene.logic();
}

function handleRenderFrame() {
    scene.draw();
}

export function initialize(theCanvas: HTMLCanvasElement) {
    canvas = theCanvas;
    canvasContext = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: false,
        // TODO storage:
    }) as CanvasRenderingContext2D;
    scene = NULL_SCENE;
}

export function startLoop(logicFrameMilliseconds: number) {

    // regular call only to the logic callback
    setInterval(function () {
        handleLogicFrame();
    }, logicFrameMilliseconds);

    // render every visible frame
    function renderLooper(_now: number) {
        // now = _now; TODO check if this the same as performance.now()
        now = performance.now();
        requestAnimationFrame(renderLooper);
        const fraction = 0;
        handleRenderFrame();
    }
    requestAnimationFrame(renderLooper);

}

export function setScene(newScene: Scene) {
    scene = newScene;
}

export const keyState: {[keyCode: string]: boolean} = {};

export function onKeyDown(event: any) {
    (keyState as any)[event.key] = true;
}

export function onKeyUp(event: any) {
    (keyState as any)[event.key] = false;
}

export interface Constructor<T> {
    new(...args: any[]): T
}

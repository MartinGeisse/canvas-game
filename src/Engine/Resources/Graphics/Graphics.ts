import {Texture} from "./Texture";
import {Animation} from "./Animation";

export interface Textures {
    [key: string]: Texture
}
export const textures: Textures = {};

export interface Animations {
    [key: string]: Animation
}
export const animations: Animations = {};

function loadImage(name: string, extension: string = 'png'): HTMLImageElement {
    const image = new Image();
    image.src = 'resources/' + name + '.' + extension;
    return image;
}

export function loadTexture(name: string) {
    textures[name] = new Texture(loadImage(name));
}

export function loadTextures(names: string[]) {
    for (const i in names) {
        loadTexture(names[i]);
    }
}

export function loadAnimation(name: string, filenamePattern: string, frameCount: number, duration: number) {
    const frames: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
        const filename = filenamePattern.replace('$', i.toString());
        const image = loadImage(filename);
        frames.push(image);
    }
    animations[name] = new Animation(frames, duration);
}

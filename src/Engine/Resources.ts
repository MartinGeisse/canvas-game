
namespace Resources {

    // TODO import properly
    declare var Howl : any;

    //
    // drawable types
    //

    export interface Drawable {
        
        draw(x : number, y : number, width : number, height : number, deltaTime? : number) : void;

        isExpired(deltaTime : number) : boolean;

    }

    export class Texture implements Drawable {

        public imageElement : HTMLImageElement;

        public draw(x : number, y : number, width : number, height : number, deltaTime : number = 0) : void {
            Engine.canvasContext.drawImage(this.imageElement, x, y, width, height);
        }

        public isExpired(deltaTime : number) : boolean {
            return false;
        }

    }

    export class Animation implements Drawable {

        public frames : HTMLImageElement[];
        public duration : number;

        public draw(x : number, y : number, width : number, height : number, deltaTime : number = 0) : void {
            var frameIndex : number = Math.floor(deltaTime * this.frames.length / this.duration);
            if (frameIndex >= 0 && frameIndex < this.frames.length) {
                var frame = this.frames[frameIndex];
                Engine.canvasContext.drawImage(frame, x, y, width, height);
            }
        }

        public isExpired(deltaTime : number) : boolean {
            return deltaTime >= this.duration;
        }

    }

    //
    // collection types
    //

    export interface Textures {
        [key: string]: Texture
    }

    export interface Animations {
        [key: string]: Animation
    }

    export interface Sounds {
        [key: string]: any
    }

    //
    // collections and loading functions
    //

    function loadImage(name : string, extension : string = 'png') : HTMLImageElement {
        var image = new Image();
        image.src = 'resources/' + name + '.' + extension;
        return image;
    }

    export function loadTexture(name : string) {
        var texture = new Texture();
        texture.imageElement = loadImage(name);
        textures[name] = texture;
    }

    export function loadTextures(names : string[]) {
        for (var i in names) {
            loadTexture(names[i]);
        }
    }

    export var textures : Textures = {};

    export function loadAnimation(name : string, filenamePattern : string, frameCount : number, duration : number) {
        var frames : HTMLImageElement[] = [];
        for (var i = 0; i < frameCount; i++) {
            var filename = filenamePattern.replace('$', i.toString());
            var image = loadImage(filename);
            frames.push(image);
        }
        animations[name] = new Animation();
        animations[name].frames = frames;
        animations[name].duration = duration;
    }

    export var animations : Animations = {};

    export function loadSound(name : string) {
    /*
        sounds[name] = new Howl({
            src: ['resources/sounds/' + name + '.wav']
        });
    */
    }

    export function loadSounds(names : string[]) {
        for (var i in names) {
            loadSound(names[i]);
        }
    }

    export var sounds : Sounds = {};

}

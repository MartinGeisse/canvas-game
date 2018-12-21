
namespace Engine {

    export var now : number;

    function updateNowTimestamp() {
        now = new Date().getTime() / 1000;
    }
    updateNowTimestamp();

    export var canvas : HTMLCanvasElement = null;
    export var canvasContext : CanvasRenderingContext2D = null;
    export var scene : Scene = null;

    export class Scene {

        private idCounter : number = 0;
        private objects : SceneObject[] = [];

        add(object : SceneObject) {
            var untyped = object as any;
            if ('_engine_scene' in untyped) {
                if (untyped._engine_scene === this) {
                    return;
                } else {
                    untyped._engine_scene.remove(object);
                }
            }
            untyped._engine_scene = this;
            untyped._engine_sceneObjectId = this.idCounter;
            this.objects[this.idCounter] = object;
            this.idCounter++;
        }

        remove(object : SceneObject) {
            var untyped = object as any;
            if (('_engine_scene' in untyped) && (untyped._engine_scene === this)) {
                delete this.objects[untyped._engine_sceneObjectId];
                delete untyped._engine_scene;
                delete untyped._engine_sceneObjectId;
            }
        }

        foreach<T extends SceneObject>(constructor : Constructor<T>, callback : (object : T) => void) {
            for (var i in this.objects) {
                var object = this.objects[i];
                if (object instanceof constructor) {
                    callback(object);
                }
            }
        }
        
        // If the logic of any object adds new objects, their .logic() will be called at the end of the current frame.
        logic() : void {
            do {
                var maxId : number = this.idCounter;
                for (var i in this.objects) {
                    var object = this.objects[i];
                    if ((object as any)._engine_sceneObjectId <= maxId) {
                        object.logic();
                    }
                }
            } while (this.idCounter != maxId);
        }

        draw(fraction : number) : void {
            var sorted : SceneObject[] = this.objects.slice();
            sorted.sort(function(x : SceneObject, y : SceneObject) : number {
                return x.getZIndex() - y.getZIndex();
            });
            for (var i in sorted) {
                sorted[i].draw(fraction);
            }
        }

    }

    export interface SceneObject {
        logic() : void;
        draw(fraction : number) : void;
        getZIndex() : number;
    }

    function handleLogicFrame() {
        updateNowTimestamp();
        if (scene != null) {
            scene.logic();
        }
    }

    function handleRenderFrame(fraction) {
        updateNowTimestamp();
        canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        if (scene != null) {
            scene.draw(fraction);
        }
    }

    export function initialize(theCanvas : HTMLCanvasElement) {
        canvas = theCanvas;
        canvasContext = canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: false,
            // TODO storage: 
        }) as CanvasRenderingContext2D;
        scene = new Scene();
    }

    export function startLoop(logicFrameMilliseconds, interpolatedRendering) {
        if (interpolatedRendering) {

            // make sure the game logic runs once before drawing -- some initialization needs this
            handleLogicFrame();

            // regular call only to the logic callback
            var lastLogicTime = new Date().getTime();
            setInterval(function() {
                handleLogicFrame();
                lastLogicTime = new Date().getTime();
            }, logicFrameMilliseconds);

            // render every visible frame
            function renderLooper() {
                var now = new Date().getTime();
                var fraction = (now - lastLogicTime) / logicFrameMilliseconds;
                handleRenderFrame(fraction);
                requestAnimationFrame(renderLooper);
            }
            requestAnimationFrame(renderLooper);

        } else {

            // regular calls to both the logic callback and the render callback
            setInterval(function() {
                handleLogicFrame();
                handleRenderFrame(0);
            }, logicFrameMilliseconds);

        }
    }

    export var keyState = [];

    export function onKeyDown(event) {
        keyState[event.key] = true;
    }

    export function onKeyUp(event) {
        keyState[event.key] = false;
    }

    export interface Constructor<T> {
        new (...args: any[]): T
    }

}


namespace Engine {

    // Can be used by game code, but should NOT be used for logic since its accuracy is limited. This is used, for
    // example, to record the starting timestamp of an animation.
    export var renderTimestamp : number = null;

    // The value of renderTimestamp during the last logic frame. Used as the starting point for the 'fraction' argument
    // during rendering.
    var lastLogicRenderTimestamp : number = null;

    export var canvas : HTMLCanvasElement = null;
    export var canvasContext : CanvasRenderingContext2D = null;
    export var scene : Scene = null;

    export class Scene {

        private nextIdToAssign : number = 0;
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
            untyped._engine_sceneObjectId = this.nextIdToAssign;
            this.objects[this.nextIdToAssign] = object;
            this.nextIdToAssign++;
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
            var minId = -1;
            do {
                var maxIdExclusive : number = this.nextIdToAssign;
                for (var i in this.objects) {
                    var object = this.objects[i];
                    var id = (object as any)._engine_sceneObjectId;
                    if (id >= minId && id < maxIdExclusive) {
                        object.logic();
                    }
                }
                minId = maxIdExclusive;
            } while (this.nextIdToAssign != maxIdExclusive);
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
        if (scene !== null) {
            scene.logic();
        }
    }

    function handleRenderFrame(fraction) {
        canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        if (scene !== null) {
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
        scene = null;
    }

    export function startLoop(logicFrameMilliseconds) {

        // The first frame does not have reliable timing, so we just demand that the game code first starts the loop,
        // then sets the first scene.
        if (scene !== null) {
            throw 'cannot call startLoop after setting a scene';
        }

        // regular call only to the logic callback
        setInterval(function() {
            lastLogicRenderTimestamp = renderTimestamp;
            handleLogicFrame();
        }, logicFrameMilliseconds);

        // render every visible frame
        function renderLooper(now) {
            requestAnimationFrame(renderLooper);
            renderTimestamp = now;
            if (lastLogicRenderTimestamp !== null) {
                var fraction = (now - lastLogicRenderTimestamp) / logicFrameMilliseconds;
                handleRenderFrame(fraction);
            }
        }
        requestAnimationFrame(renderLooper);

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

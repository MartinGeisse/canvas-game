import {canvas, canvasContext, Constructor} from "./Engine";
import {SceneObject} from "./SceneObject";

export class Scene {

    private nextIdToAssign: number = 0;
    private objects: SceneObject[] = [];
    private sortedObjects: SceneObject[] = [];
    public scrollX: number = 0;
    public scrollY: number = 0;
    public scale: number = 1;

    add(object: SceneObject): void {
        const untyped = object as any;
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
        if (object.initialize) {
            object.initialize(this);
        }
    }

    remove(object: SceneObject): void {
        const untyped = object as any;
        if (('_engine_scene' in untyped) && (untyped._engine_scene === this)) {
            delete this.objects[untyped._engine_sceneObjectId];
            delete untyped._engine_scene;
            delete untyped._engine_sceneObjectId;
        }
    }

    foreach<T extends SceneObject>(constructor: Constructor<T>, callback: (object: T) => void): void {
        for (const i in this.objects) {
            const object = this.objects[i];
            if (object instanceof constructor) {
                callback(object);
            }
        }
    }

    // If the logic of any object adds new objects, their .logic() will be called at the end of the current frame.
    logic(): void {

        // call .logic() for all objects
        let minId = -1;
        let maxIdExclusive: number = -1;
        do {
            maxIdExclusive = this.nextIdToAssign;
            for (const i in this.objects) {
                const object = this.objects[i];
                const id = (object as any)._engine_sceneObjectId;
                if (id >= minId && id < maxIdExclusive) {
                    object.logic();
                }
            }
            minId = maxIdExclusive;
        } while (this.nextIdToAssign != maxIdExclusive);

        // sort objects for subsequent rendering
        this.sortedObjects = this.objects.slice();
        this.sortedObjects.sort(function (x: SceneObject, y: SceneObject): number {
            return x.getZIndex() - y.getZIndex();
        });

    }

    draw(): void {
        if (canvas === null || canvasContext === null) {
            return;
        }

        // draw the background (not a scene object because its size adjusts to the screen, not to game logic)
        canvasContext.resetTransform();
        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        // draw game objects
        canvasContext.setTransform(this.scale, 0, 0, this.scale, -this.scrollX * this.scale, -this.scrollY * this.scale);
        for (const i in this.sortedObjects) {
            this.sortedObjects[i].draw();
        }

    }

}

export const NULL_SCENE = new Scene();

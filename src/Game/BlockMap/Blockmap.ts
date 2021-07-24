import {NULL_SCENE, Scene} from "../../Engine/Scene";
import {BlockType, NULL_BLOCK_TYPE} from "./BlockType";
import {SceneObject} from "../../Engine/SceneObject";
import {canvas} from "../../Engine/Engine";

export class Blockmap implements SceneObject {

    private scene: Scene = NULL_SCENE;
    public readonly width: number;
    public readonly height: number;
    public readonly matrix: Uint8Array;
    public readonly blockTable: BlockType[];

    public constructor(width: number, height: number, blockTable: BlockType[]) {
        if (blockTable.length < 1) {
            throw 'empty block table';
        }
        this.width = width;
        this.height = height;
        this.matrix = new Uint8Array(width * height);
        this.blockTable = blockTable;
    }

    initialize(scene: Scene): void {
        this.scene = scene;
    }

    public getCode(x: number, y: number): number {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 0;
        } else {
            return this.matrix[y * this.width + x];
        }
    }

    public getBlock(x: number, y: number): BlockType {
        let code: number = this.getCode(x, y);
        if (code < 0 || code >= this.blockTable.length) {
            code = 0;
        }
        return this.blockTable[code];
    }

    public setCode(x: number, y: number, code: number): void {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.matrix[y * this.width + x] = code;
        }
    }

    public setBlock(x: number, y: number, blockType: BlockType): void {
        this.setCode(x, y, this.findCodeForBlockType(blockType));
    }

    public findCodeForBlockType(blockType: BlockType): number {
        for (let i: number = 0; i < this.blockTable.length; i++) {
            if (this.blockTable[i] === blockType) {
                return i;
            }
        }
        return -1;
    }

    public logic(): void {
    }

    public draw(): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const blockType: BlockType = this.getBlock(x, y);
                if (blockType.drawable != null) {
                    blockType.drawable.draw(x, y, 1, 1);
                }
            }
        }
    }

    public getZIndex(): number {
        return 1;
    }

    public foreach(x1: number, y1: number, x2: number, y2: number, callback: (x: number, y: number, blockType: BlockType) => void): void {
        for (let x = Math.floor(x1); x < Math.ceil(x2); x++) {
            for (let y = Math.floor(y1); y < Math.ceil(y2); y++) {
                callback(x, y, this.getBlock(x, y));
            }
        }
    }

    public any(x1: number, y1: number, x2: number, y2: number, predicate: (blockType: BlockType) => boolean): boolean {
        return this.anyAll(x1, y1, x2, y2, predicate, true);
    }

    public all(x1: number, y1: number, x2: number, y2: number, predicate: (blockType: BlockType) => boolean): boolean {
        return this.anyAll(x1, y1, x2, y2, predicate, false);
    }

    private anyAll(x1: number, y1: number, x2: number, y2: number, predicate: (blockType: BlockType) => boolean, onMixed: boolean): boolean {
        for (let x = Math.floor(x1); x < Math.ceil(x2); x++) {
            for (let y = Math.floor(y1); y < Math.ceil(y2); y++) {
                if (predicate(this.getBlock(x, y)) == onMixed) {
                    return onMixed;
                }
            }
        }
        return !onMixed;
    }

    public confineScrolling(): void {
        if (canvas === null) {
            return;
        }
        const canvasWidthBlocks = canvas.width / this.scene.scale;
        const canvasHeightBlocks = canvas.height / this.scene.scale;
        this.scene.scrollX = Math.max(Math.min(this.scene.scrollX, this.width - canvasWidthBlocks), 0);
        this.scene.scrollY = Math.max(Math.min(this.scene.scrollY, this.height - canvasHeightBlocks), 0);
    }

}

export const NULL_BLOCK_MAP: Blockmap = new Blockmap(0, 0, [NULL_BLOCK_TYPE]);

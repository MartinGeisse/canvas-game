import {Player} from "../Player";
import {Drawable} from "../../Engine/Resources/Graphics/Drawable";
import {NULL_DRAWABLE} from "../../Engine/Resources/Graphics/NULL_DRAWABLE";

export class BlockType {

    public onPlayerTouch?(player: Player, x: number, y: number): void;

    constructor(
        public drawable: Drawable,
        public solid: boolean
    ) {
    }

}

export const NULL_BLOCK_TYPE: BlockType = new BlockType(NULL_DRAWABLE, false);

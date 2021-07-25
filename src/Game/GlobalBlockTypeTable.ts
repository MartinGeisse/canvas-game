import {NULL_DRAWABLE} from "../Engine/Resources/Graphics/NULL_DRAWABLE";
import {textures} from "../Engine/Resources/Graphics/Graphics";
import {BlockType} from "./BlockMap/BlockType";

export var globalBlockTypeTable: { [key: string]: BlockType } = {};

export function initializeGlobalBlockTypeTable() {
    globalBlockTypeTable.empty = new BlockType(NULL_DRAWABLE, false);
    globalBlockTypeTable.block = new BlockType(textures.emptybox, true);
    globalBlockTypeTable.coinbox = new BlockType(textures.coinbox, true);
    globalBlockTypeTable.coin = new BlockType(textures.coin, false);
    globalBlockTypeTable.deepGround = new BlockType(textures.deepGround, true, true);
}

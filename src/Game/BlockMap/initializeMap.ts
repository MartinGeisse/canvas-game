import {MapDecodingLookup} from "./MapDecodingLookup";
import {MapBlockDecoder} from "./MapBlockDecoder";
import {globalBlockTypeTable} from "../GlobalBlockTypeTable";
import {BlockType} from "./BlockType";
import {Blockmap} from "./Blockmap";

export function createMap(encodedMap: string[], decodingLookup: MapDecodingLookup): Blockmap {

    // decode decoders
    function buildBlockTypeIdDecoder(blockTypeId: string): MapBlockDecoder {
        const decoder: MapBlockDecoder = (x, y) => setMapBlock(x, y, globalBlockTypeTable[blockTypeId]);
        decoder.blockTypeIds = [blockTypeId];
        return decoder;
    }

    function buildArrayDecoder(entry: any[]): MapBlockDecoder {
        for (let i = 0; i < entry.length; i++) {
            if (typeof entry[i] != 'string') {
                throw 'map decoder entry is an array but contains non-string ' + entry[i];
            }
        }
        // TODO seed the random number generator so placement is random but does not change when re-entering a room
        const blockTypeIdArray = entry as string[];
        const decoder: MapBlockDecoder = (x, y) => {
            const blockTypeId = blockTypeIdArray[Math.floor(Math.random() * blockTypeIdArray.length)];
            setMapBlock(x, y, globalBlockTypeTable[blockTypeId]);
        };
        decoder.blockTypeIds = blockTypeIdArray;
        return decoder;
    }

    function buildDecoder(entry: any): MapBlockDecoder {
        if (typeof entry == 'string') {
            return buildBlockTypeIdDecoder(entry);
        } else if (typeof entry == 'object' && 'length' in entry) {
            return buildArrayDecoder(entry);
        } else if (typeof entry == 'object' && 'blockTypeIds' in entry) {
            return entry as MapBlockDecoder;
        } else if (typeof entry == 'function') {
            const decoder: MapBlockDecoder = entry as MapBlockDecoder;
            if (!('blockTypeIds' in (decoder as any))) {
                decoder.blockTypeIds = [];
            }
            return decoder;
        } else {
            throw "invalid entry in map decoding lookup: " + entry;
        }
    }

    const decoders: { [key: string]: MapBlockDecoder } = {};
    for (const i in decodingLookup) {
        decoders[i] = buildDecoder(decodingLookup[i]);
    }

    // determine all used block type IDs, removing duplicates
    const blockTypeIdSet: {[id: string]: boolean} = {};
    for (const i in decoders) {
        const thisDecoderBlockTypeIds = decoders[i].blockTypeIds;
        for (const j in thisDecoderBlockTypeIds) {
            const blockTypeId = thisDecoderBlockTypeIds[j];
            blockTypeIdSet[blockTypeId] = true;
        }
    }

    // Assign local codes to used block types. Note that we don't need a mapping to obtain local
    // block type codes from GameBlockType objects -- the Map object will do that for us.
    const localBlockTypeTable: BlockType[] = [];
    for (const blockTypeId in blockTypeIdSet) {
        localBlockTypeTable.push(globalBlockTypeTable[blockTypeId]);
    }

    // determine map size and build an empty map
    let width = 0;
    for (const i in encodedMap) {
        const rowWidth = encodedMap[i].length;
        if (rowWidth > width) {
            width = rowWidth;
        }
    }
    const height = encodedMap.length;
    const map: Blockmap = new Blockmap(width, height, localBlockTypeTable);

    // decode map
    function setMapBlock(x: number, y: number, block: BlockType) {
        map.setBlock(x, y, block);
    }

    for (let y = 0; y < height; y++) {
        const encodedRow = encodedMap[y];
        for (let x = 0; x < encodedRow.length; x++) {
            const codeCharacter: string = encodedRow[x];
            const decoder = decoders[codeCharacter];
            decoder(x, y);
        }
    }

    return map;
}

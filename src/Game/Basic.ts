
namespace Game {

    export interface MapDecodingLookup {
        [key: string]: string
    }

    export interface MapBlockDecoder {
        (x : number, y : number) : void;
        blockTypeIds : string[];
    }

    export class Scene extends Engine.Scene {

        public map : StandardLibrary.Map;
        public player : Player;

        constructor()  {
            super();
            this.scale = 30;
        }

        initializeMap(encodedMap : string[], decodingLookup : MapDecodingLookup) {

            // decode decoders
            function buildBlockTypeIdDecoder(blockTypeId : string) : MapBlockDecoder {
                var decoder : MapBlockDecoder = function(x, y) {
                    setMapBlock(x, y, globalBlockTypeTable[blockTypeId]);
                } as MapBlockDecoder;
                decoder.blockTypeIds = [blockTypeId];
                return decoder;
            }
            function buildArrayDecoder(entry : any[]) : MapBlockDecoder {
                for (var i = 0; i < entry.length; i++) {
                    if (typeof entry[i] != 'string') {
                        throw 'map decoder entry is an array but contains non-string ' + entry[i];
                    }
                }
                // TODO seed the random number generator so placement is random but does not change when re-entering a room
                var blockTypeIdArray = entry as string[];
                var decoder : MapBlockDecoder = function(x, y) {
                    var blockTypeId = blockTypeIdArray[Math.floor(Math.random() * blockTypeIdArray.length)];
                    setMapBlock(x, y, globalBlockTypeTable[blockTypeId]);
                } as MapBlockDecoder;
                decoder.blockTypeIds = blockTypeIdArray;
                return decoder;
            }
            function buildDecoder(entry : any) : MapBlockDecoder {
                if (typeof entry == 'string') {
                    return buildBlockTypeIdDecoder(entry);
                } else if (typeof entry == 'object' && 'length' in entry) {
                    return buildArrayDecoder(entry);
                } else if (typeof entry == 'object' && 'blockTypeIds' in entry) {
                    return entry as MapBlockDecoder;
                } else if (typeof entry == 'function') {
                    var decoder : MapBlockDecoder = entry as MapBlockDecoder;
                    if (!('blockTypeIds' in (decoder as any))) {
                        decoder.blockTypeIds = [];
                    }
                    decoders[i] = entry as any;
                } else {
                    throw 'invalid entry in map decoding lookup: ' + decodingLookup[i];
                }
            }
            var decoders : {[key: string]: MapBlockDecoder} = {};
            for (var i in decodingLookup) {
                decoders[i] = buildDecoder(decodingLookup[i]);
            }

            // determine all used block type IDs, removing duplicates
            var blockTypeIdSet = {};
            for (var i in decoders) {
                var thisDecoderBlockTypeIds = decoders[i].blockTypeIds;
                for (var j in thisDecoderBlockTypeIds) {
                    var blockTypeId = thisDecoderBlockTypeIds[j];
                    blockTypeIdSet[blockTypeId] = true;
                }
            }

            // Assign local codes to used block types. Note that we don't need a mapping to obtain local
            // block type codes from BlockType objects -- the Map object will do that for us.
            var localBlockTypeTable : BlockType[] = [];
            for (var blockTypeId in blockTypeIdSet) {
                localBlockTypeTable.push(globalBlockTypeTable[blockTypeId]);
            }

            // determine map size and build an empty map
            var width = 0;
            for (var i in encodedMap) {
                var rowWidth = encodedMap[i].length;
                if (rowWidth > width) {
                    width = rowWidth;
                }
            }
            var height = encodedMap.length;
            var map : StandardLibrary.Map = new StandardLibrary.Map(width, height, localBlockTypeTable);

            // decode map
            function setMapBlock(x : number, y : number, block : BlockType) {
                map.setBlock(x, y, block);
            }
            for (var y = 0; y < height; y++) {
                var encodedRow = encodedMap[y];
                for (var x = 0; x < encodedRow.length; x++) {
                    var codeCharacter : string = encodedRow[x];
                    var decoder = decoders[codeCharacter];
                    decoder(x, y);
                }
            }
            this.add(map);
            this.map = map;

        }

        addPlayer(x, y) {
            var player : Player = new Player();
            player.x = 2;
            player.y = 3.0;
            this.add(player);
            this.player = player;
        }

    }

    export class BlockType extends StandardLibrary.BlockType {

        constructor(image : Resources.Texture, public solid : boolean) {
            super(image);
        }

    }

    export abstract class Sprite extends StandardLibrary.Sprite {

        constructor() {
            super();
            this.width = 1;
            this.height = 1;
        }

        getZIndex() : number {
            return 2;
        }

        collidesWithBlockmap() : boolean {
            var map : StandardLibrary.Map = (Engine.scene as Scene).map;
            return map.any(this.x, this.y, this.x + this.width, this.y + this.height, type => (type as BlockType).solid);
        }

    }
    
}

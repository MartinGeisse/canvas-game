/**
 * This is a function that gets "called" by using a specific character in the encoded map (string array) with the x
 * and y position of that character as the parameter. Its effect is to do somethin in the scene -- typically setting
 * the corresponding block in the block map, but also placing enemies and special triggers.
 *
 * Each instance also contains an array of block type IDs it uses. That is, if the effect of this decoder is to set
 * blocks in the block map, then all block types it may set must be contained in that array. This is used to build
 * a local mapping table for block types, such that the block map can be represented by an integer array internally.
 *
 * If this decoder placed a block type into the block map that is not contained in the array of any decoder, then an
 * error would occur because no local index could be determined for that block. Thus, all decoders should report the
 * block types they might use. Reporting additional block types is not an error, as long as the local block type table
 * does not overflow (max 256 entries).
 */
export interface MapBlockDecoder {
    (x: number, y: number): void;

    blockTypeIds: string[];
}

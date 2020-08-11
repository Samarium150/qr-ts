/**
 * @packageDocumentation
 * @module utils
 */

/**
 * The class containing 8-bit value and indices information
 */
abstract class Codeword {

    /** The index through all blocks before interleaving */
    protected pre_interleave_index = -1;
    /** The index of a block in an array of blocks */
    protected block_index = -1;
    /** The index in a block */
    protected index = -1;
    /** The index through all blocks after interleaving */
    protected post_interleave_index = -1;
    /** The 8-bit value */
    protected readonly value: number;

    /**
     * Create a new Codeword instance
     *
     * @param value  The 8-bit value represented by an integer
     * @protected
     */
    protected constructor(value: number) {
        if (value < 0 || value > 255) throw Error(`Invalid Value ${value}`);
        this.value = value;
    }

    /**
     * Set the index of a block
     *
     * @param value  The index of a block
     */
    public setBlockIndex(value: number): void {this.block_index = value;}

    /**
     * Set the index of itself in a block
     *
     * @param value  The index of itself
     */
    public setIndex(value: number): void {this.index = value;}

    /**
     * Set the index of itself through all blocks before interleaving
     *
     * @param value  The index through all blocks before interleaving
     */
    public setPreInterleaveIndex(value: number): void {this.pre_interleave_index = value;}

    /**
     * Set the index of itself through all blocks after interleaving
     *
     * @param value  The index through all blocks after interleaving
     */
    public setPostInterleaveIndex(value: number): void {this.post_interleave_index = value;}

    /** Return the 8-bit value */
    public getValue(): number {return this.value;}
}

/**
 * The class for containing 8-bit value of encoded data
 */
class DataCodeword extends Codeword {
    /**
     * Create a new DataCodeword instance
     *
     * @param value  The 8-bit value of encoded data
     */
    constructor(value: number) {
        super(value);
    }
}

/**
 * The class for containing 8-bit value of error correction data
 */
class ECCodeword extends Codeword {
    /**
     * Create a new ECCodeword instance
     *
     * @param value  The 8-bit value of error correction data
     */
    constructor(value: number) {
        super(value);
    }
}

export {
    Codeword,
    DataCodeword,
    ECCodeword
};

class Codeword {

    protected pre_interleave_index: number = -1;
    protected block_index: number = -1;
    protected index: number = -1;
    protected post_interleave_index: number = -1;
    public value: number;

    protected constructor(value: number) {
        if (value < 0 || value >= 255) throw Error("Invalid Value");
        this.value = value;
    }

    public setBlockIndex(value: number) {this.block_index = value;}

    public setIndex(value: number) {this.index = value;}

    public setPreInterleaveIndex(value: number) {this.pre_interleave_index = value;}

    public setPostInterleaveIndex(value: number) {this.post_interleave_index = value;}
}

class DataCodeword extends Codeword {

    private pre_ec_index: number = -1;

    constructor(value: number) {
        super(value);
    }

    public setPreEcIndex(n: number) {
        this.pre_ec_index = n;
    }
}

class EcCodeword extends Codeword {
    constructor(value: number) {
        super(value);
    }
}

export {Codeword, DataCodeword, EcCodeword};
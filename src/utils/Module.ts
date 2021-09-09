/**
 * @module utils
 */
import { Functional } from "./types";

/**
 * The Class representing a square in QR code
 */
class Module {

    /** TRUE for dark, FALSE for light */
    protected color = false;

    /**
     * Create a new Module instance
     *
     * @param color - The binary data represented by boolean
     */
    constructor(color?: boolean) {
        if (color) this.color = color;
    }

    /**
     * Set the color to a new value
     *
     * @param value - The new color
     */
    public setColor(value: boolean): void {this.color = value;}

    /** Return the color */
    public getColor(): boolean {return this.color;}

    /** Deep copy itself */
    public copy(): Module {return new Module(this.color);}
}

/** The class representing a square that is an encoded data */
class DataModule extends Module {}

/** The class representing a square that is for functionalities */
class FunctionalModule extends Module {

    /** The type of the functionality */
    private readonly type: Functional;

    /**
     * Create a new FunctionModule instance
     *
     * @param type - The type of the functionality
     * @param color - The binary data represented by boolean
     */
    constructor(type: Functional, color: boolean) {
        super(color);
        this.type = type;
    }

    /** Return the type of the functionality */
    public getType(): Functional {return this.type;}

    /** Deep copy itself */
    public copy(): FunctionalModule {return new FunctionalModule(this.type, this.color);}
}

/** The class representing a square that is for masking purpose */
class MaskModule extends Module {}

/** The class representing a square that is always light for decoration */
class QuietModule extends Module {}

export {
    Module,
    DataModule,
    FunctionalModule,
    MaskModule,
    QuietModule
};

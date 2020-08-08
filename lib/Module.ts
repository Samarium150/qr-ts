import {Functional} from "./types";

class Module {

    protected color = false;

    constructor(color?: boolean) {
        if (color) this.color = color;
    }

    public setColor(value: boolean): void {this.color = value;}
    public getColor(): boolean {return this.color;}
    public copy(): Module {return new Module(this.color);}
}

class DataModule extends Module {}

class FunctionalModule extends Module {

    private readonly type: Functional;

    constructor(type: Functional, color: boolean) {
        super(color);
        this.type = type;
    }

    public getType(): Functional {return this.type;}
    public copy(): FunctionalModule {return new FunctionalModule(this.type, this.color);}
}

class MaskModule extends Module {}

class QuietModule extends Module {}

export {
    Module,
    DataModule,
    FunctionalModule,
    MaskModule,
    QuietModule
};

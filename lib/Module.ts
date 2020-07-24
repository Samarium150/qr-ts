import * as types from "./types";

class Module {

    protected color: boolean = false;

    public setColor(value: boolean) {this.color = value;}

    public getColor(): boolean {return this.color;}
}

class FunctionalModule extends Module{

    private readonly type: types.Function;

    constructor(type: types.Function, color: boolean) {
        super();
        this.color = color;
        this.type = type;
    }

    public getType(): types.Function {return this.type;}
}


export {Module, FunctionalModule};
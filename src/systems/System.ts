import { ISystem, IWorld } from "../types";

abstract class System implements ISystem {
    private enabled: boolean;
    constructor() {
        this.enabled = true;
    }

    public disable() {
       this.enabled = false;
       return this.enabled;
    }

    public enable() {
        this.enabled = true;
        return this.enabled;
    }

    public process(_entities: IWorld["entities"], _deltaTime: number) {}
}

export { System };
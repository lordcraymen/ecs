import { ISystem, IWorld } from "../types";

class System implements ISystem {
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

    public update(world: IWorld, deltaTime: number) {
        throw new Error('Method not implemented.');
    }
}

export { System };
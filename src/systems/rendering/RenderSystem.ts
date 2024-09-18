import { IWorld } from "../../types";
import { System } from "../System";

class DomRenderSystem extends System {
    private readonly domRoot: HTMLElement;
    constructor(domRoot: HTMLElement) {
        super();
        this.domRoot = domRoot;
    }

    update(world:IWorld, deltaTime: number) {
    }
}

export { DomRenderSystem };
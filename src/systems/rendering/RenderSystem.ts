import { IWorld } from "../../types";
import { System } from "../System";
import { BoundsComponent, PositionComponent } from "../../components";


class DomRenderSystem extends System {
    private RenderedEntityMap: Map<string, HTMLElement> = new Map();
    private readonly domRoot: HTMLElement;
    constructor(domRoot: HTMLElement) {
        super();
        this.domRoot = domRoot;
    }

    process(entities:IWorld["entities"], _deltaTime: number) {

        entities.forEach(entity => {

            
            const position = entity.getComponent("Position") as PositionComponent;
            const bounds = entity.getComponent("Bounds") as BoundsComponent;
            if (!position || !bounds) { console.log(`Entity ${entity.id} can not be rendered, no Position and Bounds are undefined`); return };
            
            const element = this.RenderedEntityMap.get(entity.id) || this.RenderedEntityMap.set(entity.id, document.createElement("div")).get(entity.id)!;
            
            if (!this.domRoot.contains(element)) {
                this.domRoot.appendChild(element);
            }

            if (position.hasUpdate()) {
                element.style.transform = `translate(${position.x}px, ${position.y}px)`;
            }

            if (bounds.hasUpdate()) {
                element.style.width = `${bounds.width}px`;
                element.style.height = `${bounds.height}px`;
            }

            element.style.border = "1px solid black";
        });
    }
}

export { DomRenderSystem };
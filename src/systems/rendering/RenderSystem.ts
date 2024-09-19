import { IWorld, IEntity } from "../../types";
import { System } from "../System";
import { BoundsComponent, PositionComponent } from "../../components";

const RenderedEntityMap = new Map<string, HTMLElement>();

class DomRenderSystem extends System {
    private readonly domRoot: HTMLElement;
    constructor(domRoot: HTMLElement) {
        super();
        this.domRoot = domRoot;
    }

    process(entities:IWorld["entities"], _deltaTime: number) {

        entities.forEach(entity => {
            const position = entity.components["Position"] as PositionComponent;
            const bounds = entity.components["Bounds"] as BoundsComponent;
            if (!position || !bounds) { console.log(`Entity ${entity.id} can not be rendered, no Position and Bounds are undefined`); return };
            if(!entities.has(entity)) return;
            const element = RenderedEntityMap.get(entity.id) || RenderedEntityMap.set(entity.id, document.createElement("div")).get(entity.id)!;
            
            element.style.position = "absolute";
            element.style.width = `${bounds.width}px`;
            element.style.height = `${bounds.height}px`;
            element.style.left = `${position.x}px`;
            element.style.top = `${position.y}px`;
            element.style.backgroundColor = "black";
            
            this.domRoot.appendChild(element);
            ;
        });
    }
}

export { DomRenderSystem };
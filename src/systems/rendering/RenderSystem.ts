import { IWorld } from "../../types";
import { System } from "../System";
import { BoundsComponent, PositionComponent, SelectionComponent } from "../../components";


class DomRenderSystem extends System {
    private RenderedEntityMap: Map<string, HTMLElement> = new Map();
    private SelectableEntityMap: Map<string, EventListener> = new Map();
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
                element.style.transform = `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`;
            }

            if (bounds.hasUpdate()) {
                element.style.width = `${bounds.width}px`;
                element.style.height = `${bounds.height}px`;
            }

            element.style.border = "1px solid black";

            const selectable = entity.getComponent("Selection") as SelectionComponent;

            if (selectable) {
                if (!this.SelectableEntityMap.has(entity.id)) {
                    const onClick = (e: Event) => {
                        console.log(`Entity ${entity.id} was clicked`); 
                        selectable.isSelected = !selectable.isSelected;
                        e.stopPropagation();
                        e.preventDefault();
                        const target = e.target as HTMLElement;
                        if(target) { target.style.backgroundColor = selectable.isSelected ? "red" : "transparent" };
                    };
                    element.addEventListener("click", onClick);
                    this.SelectableEntityMap.set(entity.id, onClick);
                } 
            } else {
                const onClick = this.SelectableEntityMap.get(entity.id);
                if (onClick) {
                    element.removeEventListener("click", onClick);
                    this.SelectableEntityMap.delete(entity.id);
                }
            }

        });
    }
}

export { DomRenderSystem };